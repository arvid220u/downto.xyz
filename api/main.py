import base64
import pytz
from datetime import datetime
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
from Crypto.Cipher import AES, PKCS1_OAEP
import hashlib
import jwt
from ratelimiter import RateLimiter
import emailtemplater
from fakedb import FakeDB
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import smtplib
from fastapi.middleware.cors import CORSMiddleware
import os
import re
from dotenv import load_dotenv
import urllib.parse
from databases import Database

RATE_LIMIT = 100
EMAIL_PATH = "simpleemail.html"
DATABASE_PATH = "test.db"

db = Database(f"sqlite:///{DATABASE_PATH}")

load_dotenv()

SMTP_LOGIN = os.getenv("SMTP_LOGIN", None)
if SMTP_LOGIN is None:
    raise RuntimeError("env variable SMTP_LOGIN must have value!")

SECRET_KEY = os.getenv("SECRET_KEY", None)
if SECRET_KEY is None:
    raise RuntimeError("env variable SECRET_KEY must have value!")

fdb = FakeDB()

app = FastAPI()

rl = RateLimiter(fdb, RATE_LIMIT)
emailTemp = emailtemplater.Email(EMAIL_PATH)

origins = ["http://localhost", "http://localhost:3000", "https://downto.xyz"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def database_connect():
    await db.connect()
    await init_db()


@app.on_event("shutdown")
async def database_disconnect():
    await db.disconnect()


class Verify(BaseModel):
    email: str


def is_mit_email(m):
    rgx = r"[a-z0-9_]+@mit\.edu"
    if re.match(rgx, m) is None:
        return False
    else:
        return True


def authenticated(sessionkey: str, email: str):
    try:
        decoded = jwt.decode(sessionkey, "secret", algorithms=["HS256"])
        if "email" not in decoded:
            return False
        if decoded["email"] != email:
            return False
        return True
    except jwt.exceptions.InvalidSignatureError:
        return False


@app.post("/verify")
def verify(v: Verify):

    if not is_mit_email(v.email):
        return HTTPException(
            status_code=403, detail="Only MIT emails allowed at the moment."
        )

    if not rl.ok():
        raise HTTPException(status_code=429, detail="Rate limited :(")

    key = jwt.encode(
        {"email": v.email, "iat": datetime.now(tz=pytz.utc)},
        SECRET_KEY,
        algorithm="HS256",
    )

    with smtplib.SMTP(host="smtp-broadcasts.postmarkapp.com", port=25) as smtp:
        sender = "verify-email@downto.xyz"
        receivers = [v.email]
        message = f"""From: downto.xyz <{sender}>
To: {v.email}
Subject: Please verify your email
X-PM-Message-Stream: outbound

Please go to this link: https://downto.xyz/verify?u={urllib.parse.quote(v.email)}&k={key}

have fun :)
"""
        smtp.starttls()
        smtp.login(SMTP_LOGIN, SMTP_LOGIN)
        smtp.sendmail(sender, receivers, message)

    return "OK"


class Match(BaseModel):
    to: str
    w: str
    type: str


def kerbify(s: str):
    return s.split("@")[0]


def send_match(m: Match):

    if not rl.ok():
        raise HTTPException(status_code=429, detail="Rate limited :(")

    with smtplib.SMTP(host="smtp-broadcasts.postmarkapp.com", port=25) as smtp:
        sender = "hi@downto.xyz"
        receivers = [m.to]
        message = f"""From: downto.xyz <{sender}>
Subject: you matched with {kerbify(m.w)}!
Content-Type: text/html
X-PM-Message-Stream: broadcast

""" + emailTemp.get(
            m.to, m.w, m.type
        )
        smtp.starttls()
        smtp.login(SMTP_LOGIN, SMTP_LOGIN)
        smtp.sendmail(sender, receivers, message)


class Like(BaseModel):
    identifier: str
    nonce: str
    email0: str
    email1: str


class Update(BaseModel):
    sessionkey: str
    email: str
    publickey: str
    likes: List[Like]


class GetSecrets(BaseModel):
    sessionkey: str
    email: str
    emails: List[str]


@app.post("/getsecrets")
async def getsecrets(g: GetSecrets):
    if not authenticated(g.sessionkey, g.email):
        raise HTTPException(status_code=401, detail="Incorrect session key :(")

    if not rl.ok():
        raise HTTPException(status_code=429, detail="Rate limited :(")

    ans = {}

    for email in g.emails:
        q = f"SELECT pk FROM users WHERE email = {email}"
        pk = await db.fetch_all(query=q)
        q = f"SELECT sk1, sk2 FROM secrets WHERE (email1, email2) = ({g.email, email})"
        sk1, sk2 = await db.fetch_all(query=q)
        ans.append({"email": email, "pk": pk, "sk1": sk1, "sk2": sk2})

    return ans


@app.post("/update")
async def update(u: Update):
    if not authenticated(u.sessionkey, u.email):
        raise HTTPException(status_code=401, detail="Incorrect session key :(")

    if not rl.ok():
        raise HTTPException(status_code=429, detail="Rate limited :(")

    # 1. update public key
    q = f"INSERT INTO users (email, publickey) VALUES ({u.email}, {u.publickey})"
    await db.execute(query=q)

    # 2. check if match
    for like in u.likes:
        if u.email not in {like.email0, like.email1}:
            raise HTTPException(
                status_code=400, detail="User email not in like emails :("
            )
        submitter = 0 if u.email == like.email0 else 1
        anti_submitter = 1 - submitter
        q = f"SELECT * FROM likes WHERE (identifier, submitter) = ({like.identifier, anti_submitter})"
        match = await db.fetch_all(query=q)
        print(match)
        if len(match) == 0:
            # sad :(
            q = f"INSERT INTO likes (identifier, submitter) VALUES ({like.identifier}, {submitter})"
            await db.execute(q)
        else:
            # omg yay
            # verify everything!!!
            m = hashlib.sha256()
            m.update("".join([like.email0, like.email1]).encode("utf-8"))
            h = m.digest()
            idbits = base64.b64decode(like.identifier)
            sk = bytes(a ^ b for (a, b) in zip(h, idbits))
            sk_s = base64.b64encode(sk).decode("utf-8")
            # now append the nonce
            sk_and_nonce = sk_s + like.nonce
            # now evaluate the OWF and check verification key
            vk_m = hashlib.sha256()
            vk_m.update(sk_and_nonce)
            vk_challenge = base64.b64encode(vk_m.digest())
            # get real vk
            q = f"SELECT vk FROM secrets WHERE (email1, email2) = ({like.email0, like.email1})"
            vk_real = await db.fetch_all(query=q)
            if vk_real != vk_challenge:
                # sad. someone tried to cheat
                raise HTTPException(
                    status_code=400, detail="Incorrect verification key...."
                )
            # omg an actual match!
            for email, other in [(like.email0, like.email1), (like.email1, like.email0)]:
                m = Match()
                m.to = email
                m.w = other
                m.type = "DTF"
                send_match(m)

    # 3. regenerate sk2 and vk2
    emails = list(set([l.email0 if u.email == l.email1 else l.email1 for l in u.likes]))
    for email in emails:
        sk2 = get_random_bytes(32)
        nonce = get_random_bytes(32)
        sk_and_nonce = base64.b64encode(sk2).decode("utf-8") + base64.b64encode(
            nonce
        ).decode("utf-8")
        vk_m = hashlib.sha256()
        vk_m.update(sk_and_nonce)
        vk = base64.b64encode(vk_m.digest())

        for [em1, em2] in [[email, u.email], [u.email, email]]:
            q = f"SELECT pk FROM users WHERE email = {em1}"
            pk = await db.fetch_all(q)

            recipient_key = RSA.import_key(pk)
            cipher_rsa = PKCS1_OAEP.new(recipient_key)
            enc = cipher_rsa.encrypt(sk_and_nonce.encode("utf-8"))

            q = f"SELECT sk2, vk2 FROM secrets WHERE (email1, email2) = ({em1, em2})"
            sk2, vk2 = await db.fetch_all(q)
            q = f"INSERT INTO secrets (sk1, vk1) VALUES ({sk2, vk2})"
            await db.execute(q)
            q = f"INSERT INTO secrets (sk2, vk2) VALUES ({enc, vk})"


@app.post("/test")
async def fetch_data(email: str):
    query = f"SELECT * FROM users WHERE email={email}"
    results = await db.fetch_all(query=query)

    return results


async def init_db():
    with open("schema.sql", "r") as f:
        qs = f.read().split("\n")

    for q in qs:
        await db.execute(query=q)
