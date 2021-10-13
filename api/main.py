from pydantic.networks import HttpUrl
import time
from ratelimiter import RateLimiter
import emailtemplater
from fakedb import FakeDB
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import smtplib
from fastapi.middleware.cors import CORSMiddleware
import binascii
import os
import re
from dotenv import load_dotenv
import urllib.parse

RATE_LIMIT = 100
EMAIL_PATH = "simpleemail.html"

load_dotenv()

SMTP_LOGIN = os.getenv("SMTP_LOGIN", None)
if SMTP_LOGIN is None:
    raise RuntimeError("env variable SMTP_LOGIN must have value!")

db = FakeDB()

app = FastAPI()

rl = RateLimiter(db, RATE_LIMIT)
emailTemp = emailtemplater.Email(EMAIL_PATH)

origins = ["http://localhost", "http://localhost:3000", "https://downto.xyz"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Verify(BaseModel):
    email: str
    to: Optional[str]
    message: Optional[str]


def is_mit_email(m):
    rgx = r"[a-z0-9_]+@mit\.edu"
    if re.match(rgx, m) is None:
        return False
    else:
        return True


@app.post("/verify")
def verify(v: Verify):

    if not is_mit_email(v.email):
        return HTTPException(
            status_code=403, detail="Only MIT emails allowed at the moment."
        )

    if not rl.ok():
        raise HTTPException(status_code=429, detail="Rate limited :(")

    key = binascii.b2a_hex(os.urandom(25)).decode("utf-8")
    db.put(key, f"verify:{v.email}")

    with smtplib.SMTP(host="smtp-broadcasts.postmarkapp.com", port=25) as smtp:
        sender = "verify-email@downto.xyz"
        receivers = [v.email]
        message = f"""From: downto.xyz <{sender}>
To: {v.email}
Subject: Please verify your email
X-PM-Message-Stream: outbound

Please go to this link: https://downto.xyz/verify?u={urllib.parse.quote(v.email)}&k={key}{f"&m={urllib.parse.quote(v.message)}" if v.message is not None else ""}{f"&to={urllib.parse.quote(v.to)}" if v.to is not None else ""}

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
    return s
