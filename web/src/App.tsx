import { useCallback, useRef, useEffect, useState } from "react";
import { RouteComponentProps } from "@gatsbyjs/reach-router";
import "./App.css";

const DTF = "DTF";
const DTC = "DTC";
const DTD = "DTD";
const MATCH_TYPES: string[] = [DTF, DTC, DTD];
const MATCH_EXPLANATIONS = {
  [DTF]: "(fuck)",
  [DTC]: "(cuddle)",
  [DTD]: "(date)",
};

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
          the data stored on our servers is encrypted using your password, so
          (as long as your password is long enough) you don't need to worry
          about your list of preferences being revealed at any point (assuming
          you trust somewhat rushed unaudited untested code). information is
          only revealed in the event of a match. a slightly unfortunate side
          effect of this, and the fact that MIT does not have a public key
          directory, is that a match will not be detected if person A enters
          their prefererence for B before B has verified their email, until
          person A comes back to this page and updates.
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
  return response.json(); // parses JSON response into native JavaScript objects
}

function getEmails(s) {
  const rgx = /(\S+@\S+\.\S+)/gm;
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
  const [password, setPassword] = useState("");
  const [targets, setTargets] = useState(props.targets);

  useEffect(() => {
    setTargets(props.targets);
  }, [props.targets]);

  const update = useCallback(() => {
    if (!verified) {
      alert("you must verify your email first!");
      return;
    }
    // const to = getEmails();
    // if (to.length === 0) {
    //   alert(
    //     "you need to send to at least 1 friend! no email address recognized"
    //   );
    //   return;
    // }
    // const d = {
    //   fr: email,
    //   to,
    //   key: verifiedKey,
    // };
    // post("/send", send);
    // window.history.replaceState(
    //   {},
    //   document.title,
    //   window.location.pathname +
    //     `?to=${encodeURIComponent(to.join(","))}&m=${encodeURIComponent(
    //       formattedMessage
    //     )}`
    // );
    // sent();
  }, [email, password, targets, verified, verifiedKey]);

  const resetEmail = useCallback(() => {
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("key");
    setEmail("");
  }, []);
  const verifyEmail = useCallback(() => {
    if (!isMitEmail(email)) {
      alert("you need to send from an mit.edu email address!");
      return;
    }
    let v = {
      email,
      targets,
    };
    post("/verify", v);
    alert("check your email for a verification link!");
  }, [email, targets]);

  return (
    <div className="Send mb-4">
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
      <input
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {MATCH_TYPES.map((type) => {
        return (
          <div className="inputrow">
            <div className="my-auto mx-auto mr-2 w-20">
              <span className="font-bold text-lg">{type}:</span>
              <br />
              <span className="text-xs">{MATCH_EXPLANATIONS[type]}</span>
            </div>
            <textarea
              className="inputrow"
              placeholder="friend@mit.edu, friend2@mit.edu"
              value={targets[type]}
              onChange={(e) =>
                setTargets({
                  [type]: e.target.value,
                  ...targets,
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
