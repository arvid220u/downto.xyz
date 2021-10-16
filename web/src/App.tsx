import { useCallback, useRef, useEffect, useState } from "react";
import { RouteComponentProps } from "@gatsbyjs/reach-router";
import "./App.css";
import { createSecretKey } from "crypto";
async function asyncFlatMap<T, O>(
  arr: T[],
  asyncFn: (t: T) => Promise<O[]>
): Promise<O[]> {
  return Promise.all(flatten(await asyncMap(arr, asyncFn)));
}

function flatMap<T, O>(arr: T[], fn: (t: T) => O[]): O[] {
  return flatten(arr.map(fn));
}

function asyncMap<T, O>(arr: T[], asyncFn: (t: T) => Promise<O>): Promise<O[]> {
  return Promise.all(arr.map(asyncFn));
}

function flatten<T>(arr: T[][]): T[] {
  return ([] as T[]).concat(...arr);
}

const DTF = "DTF";
const DTC = "DTC";
const DTD = "DTD";
const MATCH_TYPES: string[] = [DTF, DTC, DTD];
const MATCH_EXPLANATIONS = {
  [DTF]: "(fuck)",
  [DTC]: "(cuddle)",
  [DTD]: "(date)",
};

function _arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function Footer() {
  return (
    <footer>
      <div className="my-2 max-w-2xl mx-auto">
        <h3 className="font-bold text-lg">how does it work?</h3>
        <p className="m-2">
          you enter the @mit.edu addresses of people you are down to do things
          with. if you both indicate interest in each other for the same
          category, you will both get an email notifying you of a match!
        </p>
        <h3 className="font-bold text-lg">privacy</h3>
        <p className="m-2">
          the data stored on our servers is encrypted, so you don't need to
          worry about your list of preferences being revealed at any point
          (assuming you trust somewhat rushed unaudited untested code).
          information is only revealed in the event of a match. a slightly
          unfortunate side effect of this, and the fact that MIT does not have a
          public key directory, is that a match will not be detected if person A
          enters their preferences for B before B has verified their email,
          until person A comes back to this page and updates.
        </p>
        <p className="m-2">
          the source code is available at{" "}
          <a href="https://github.com/arvid220u/downto.xyz">
            github.com/arvid220u/downto.xyz
          </a>
          . the readme contains a more thorough description of the exact privacy
          protocol. feedback and pull requests are very welcome!
        </p>
        <h3 className="font-bold text-lg">about</h3>
        <p className="m-2">
          downto.xyz is inspired by the now-dead dildo.io. we believe that there
          should be fewer taboos, more openness and more physical intimacy in
          the world. while downto.xyz obviously isn't the end-all-be-all
          solution to any of that, we hope that it can contribute to a more open
          world, even if only by a tiny amount.
        </p>
        <p className="m-2">
          if you have any thoughts, positive or negative, email us at
          downto-board@mit.edu. it is very important to us that downto.xyz is
          good for the world, not bad, and if you have any concerns about
          anything, please let us know.
        </p>
      </div>
    </footer>
  );
}

// Example POST method implementation:
async function post(path = "", data = {}) {
  // Default options are marked with *
  const url = process.env.REACT_APP_API_URL + path;
  console.log(url);
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "no-cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  console.log(response);
  return response; // parses JSON response into native JavaScript objects
}

function getEmails(s) {
  const rgx = /([^,\s@]+@\w+\.\w+)/gm;
  const match = s.match(rgx);
  if (!match) {
    return [];
  }
  return match;
}

function isMitEmail(s) {
  const rgx = /[a-z0-9_]+@mit\.edu/gm;
  const match = s.match(rgx);
  if (!match) {
    return false;
  }
  return true;
}

type Targets = {
  [DTF]: string;
  [DTC]: string;
  [DTD]: string;
};

function Form(props: { targets: Targets }) {
  const verifiedEmail = window.localStorage.getItem("email");
  const verifiedKey = window.localStorage.getItem("key");
  const verified = verifiedEmail != null && verifiedKey != null;

  const [email, setEmail] = useState(verified ? verifiedEmail : "");
  const [key, setKey] = useState<CryptoKeyPair | null>(null);
  const [publicKey, setPublicKey] = useState("");
  const [password, setPassword] = useState("");
  const [affirmation, setAffirmation] = useState(false);
  const [targets, setTargets] = useState(props.targets);

  useEffect(() => {
    setTargets(props.targets);
  }, [props.targets]);

  const update = useCallback(async () => {
    if (!verified) {
      alert("you must verify your email first!");
      return;
    }
    if (!key || !key.privateKey) {
      alert("you need to either paste an old key or generate a new key!");
      return;
    }
    if (!affirmation) {
      alert(
        "please indicate that you are honest and serious by clicking the checkbox."
      );
      return;
    }
    console.log("update :0");
    let emailss: [string, string][] = [];
    for (const typ in targets) {
      emailss.push(
        ...getEmails(targets[typ]).map((em) => {
          return [typ, em];
        })
      );
    }
    console.log(emailss);
    // now get the sks for all of these
    const secrets = await post("/getsecrets", {
      sessionkey: verifiedKey,
      email: verifiedEmail,
      emails: emailss.map((t) => {
        return t[1];
      }),
    });
    console.log(secrets.json());
    // ok great, now what?
    const likes = await asyncFlatMap(emailss, async (t: [string, string]) => {
      const em = t[1];
      const typ = t[0];
      if (!key.privateKey || !key.publicKey) {
        alert("somethingw rong");
        return [];
      }
      const sks = secrets.json()[em];
      const skss = [sks["sk1"], sks["sk2"]];
      let ll: {
        identifier: string;
        nonce: string;
        email0: string;
        email1: string;
        type: string;
      }[] = [];
      for (const skkkkk of skss) {
        const email0 = em > verifiedEmail ? verifiedEmail : em;
        const email1 = email0 === em ? verifiedEmail : em;
        const h = `${typ}${email0}${email1}`;
        var enc = new TextEncoder();
        var dec = new TextDecoder();
        console.log(sks);
        const h_hash = await crypto.subtle.digest("SHA-256", enc.encode(h));
        console.log("HASH:");
        console.log(h_hash);
        let sk_and_nonce_s = "";
        try {
          console.log("encrypted SK:");
          console.log(skkkkk);
          console.log("public key: ");
          console.log(
            _arrayBufferToBase64(
              await crypto.subtle.exportKey("spki", key.publicKey)
            )
          );
          const sk_and_nonce = await crypto.subtle.decrypt(
            {
              name: "RSA-OAEP",
            },
            key.privateKey,
            _base64ToArrayBuffer(skkkkk)
          );
          console.log("SKA AND NONCE:");
          console.log(sk_and_nonce);
          sk_and_nonce_s = dec.decode(sk_and_nonce);
        } catch (error) {
          console.log("ERROR (ignoring it).....");
          console.log(error);
          ll.push({
            identifier: "fakeidentifier",
            nonce: "fakenonce",
            email0,
            email1,
            type: typ,
          });
          continue;
        }
        console.log("SK AND NONCE S: ");
        console.log(sk_and_nonce_s);
        const [sk_s, nonce_s] = sk_and_nonce_s.split("!");
        const sk = _base64ToArrayBuffer(sk_s);
        if (h_hash.byteLength !== sk.byteLength) {
          alert("smth very wrong");
          console.log(h_hash);
          console.log(sk);
          ll.push({
            identifier: "fakeidentifier",
            nonce: "fakenonce",
            email0,
            email1,
            type: typ,
          });
          continue;
        }
        console.log("SK");
        console.log(dec.decode(sk));
        console.log("H_HASH");
        console.log(dec.decode(h_hash));
        const sk_arr = new Uint8Array(sk);
        const h_hash_arr = new Uint8Array(h_hash);
        const id1 = new Uint8Array(sk.byteLength);
        for (var i = 0; i < id1.length; i++) {
          id1[i] = sk_arr[i] ^ h_hash_arr[i];
          console.log(
            `sk[${i}] = ${sk[i]}, h_hash[]=${h_hash[i]}, id1[]=${id1[i]}`
          );
        }
        console.log("id1");
        console.log(dec.decode(id1));
        const id1_s = _arrayBufferToBase64(id1);
        ll.push({
          identifier: id1_s,
          nonce: nonce_s,
          email0,
          email1,
          type: typ,
        });
      }
      return ll;
    });
    console.log(likes);
    const resp = await post("/update", {
      sessionkey: verifiedKey,
      email: verifiedEmail,
      publickey: publicKey,
      likes: likes,
    });
    if (resp.ok) {
      alert(
        "successfully updated preferences! check your email (and in particular your junk folder)"
      );
    } else {
      alert(`unsuccessful update: ${resp.statusText}`);
    }
  }, [
    email,
    password,
    targets,
    verified,
    verifiedKey,
    verifiedEmail,
    affirmation,
    publicKey,
    key,
  ]);

  const resetEmail = useCallback(() => {
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("key");
    setEmail("");
  }, []);
  const genKey = useCallback(async () => {
    setPassword("...generating key...");
    alert("save this key! you need to use the same key every time");
    const result = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    setKey(result);
    if (!result.publicKey || !result.privateKey) {
      alert("error :(");
      return;
    }
    const exp = await crypto.subtle.exportKey("spki", result.publicKey);
    const exp_s = _arrayBufferToBase64(exp);
    setPublicKey(exp_s);
    console.log(exp_s);
    const priv = await crypto.subtle.exportKey("pkcs8", result.privateKey);
    const priv_s = _arrayBufferToBase64(priv);
    console.log(priv_s);
    let randVal = new Uint8Array(10);
    randVal = crypto.getRandomValues(randVal);
    const new_pass = `${_arrayBufferToBase64(randVal)}!${exp_s}!${priv_s}`;
    setPassword(new_pass);
    window.localStorage.setItem("keypair", new_pass);
  }, []);
  const updateKey = useCallback(
    async (newkey) => {
      try {
        setPassword(newkey);
        const [_, pub_s, priv_s] = newkey.split("!");
        const pub_key = await crypto.subtle.importKey(
          "spki",
          _base64ToArrayBuffer(pub_s),
          { name: "RSA-OAEP", hash: "SHA-256" },
          true,
          ["encrypt"]
        );
        const priv_key = await crypto.subtle.importKey(
          "pkcs8",
          _base64ToArrayBuffer(priv_s),
          { name: "RSA-OAEP", hash: "SHA-256" },
          true,
          ["decrypt"]
        );
        setPublicKey(pub_s);
        setKey({ privateKey: priv_key, publicKey: pub_key });
        window.localStorage.setItem("keypair", newkey);
      } catch (e) {
        setPassword(password);
        alert(`invalid key: ${e}`);
      }
    },
    [password, key, setPassword, setPublicKey, setKey]
  );
  const verifyEmail = useCallback(async () => {
    if (!isMitEmail(email)) {
      alert("you need to send from an mit.edu email address!");
      return;
    }
    let v = {
      email,
      targets,
    };
    post("/verify", v);
    alert(
      "check your email (including your junk folder) for a verification link!"
    );
  }, [email, targets]);

  useEffect(() => {
    const storedKey = window.localStorage.getItem("keypair");
    if (storedKey !== password) {
      updateKey(storedKey);
    }
  }, []);

  return (
    <div className="Send mb-4 mx-4">
      <div className="inputrow">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mykerb@mit.edu"
          readOnly={verified}
        />
        <button onClick={() => (verified ? resetEmail() : verifyEmail())}>
          {verified ? "change" : "verify"}
        </button>
      </div>
      <div className="inputrow">
        <input
          type="text"
          value={password}
          placeholder="paste old key here, or generate new "
          onChange={(e) => updateKey(e.target.value)}
        />
        <button onClick={genKey}>generate</button>
      </div>
      {MATCH_TYPES.map((type) => {
        return (
          <div className="inputrow" key={`${type}1`}>
            <div className="my-auto mx-auto mr-2 w-20" key={`${type}2`}>
              <span className="font-bold text-lg" key={`${type}3`}>
                {type}:
              </span>
              <br key={`${type}4`} />
              <span key={`${type}5`} className="text-xs">
                {MATCH_EXPLANATIONS[type]}
              </span>
            </div>
            <textarea
              key={`${type}6`}
              className="inputrow"
              placeholder="friend@mit.edu, friend2@mit.edu"
              value={targets[type]}
              onChange={(e) =>
                setTargets({
                  ...targets,
                  [type]: e.target.value,
                })
              }
            />
          </div>
        );
      })}
      <div>
        <input
          className="w-3 h-3 border border-gray-300 rounded"
          type="checkbox"
          name="solemnlyswear"
          checked={affirmation}
          onClick={() => setAffirmation(!affirmation)}
        />{" "}
        <label htmlFor="solemnlyswear">
          i hereby declare that i am excited to do things with the people above,
          should we match
        </label>
      </div>
      <button onClick={update}>update</button>
      <div>(note: you can only update once every 24 hours!)</div>
      (note 2: emails are sent immediately upon a match! so please, if so only
      to avoid awkwardness, be honest. seriously)
    </div>
  );
}

function App(props: RouteComponentProps) {
  const [mode, setMode] = useState("normal");
  const [targets, setTargets] = useState({} as Targets);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const dtf = params.get("dtf");
    const dtc = params.get("dtc");
    const dtd = params.get("dtd");
    setTargets({
      [DTF]: dtf || "",
      [DTC]: dtc || "",
      [DTD]: dtd || "",
    });
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [mode]);

  return (
    <div className="App">
      <h1 className="font-bold text-xl m-2">downto.xyz</h1>
      <Form targets={targets} />
      <hr />
      <Footer />
    </div>
  );
}

export default App;
