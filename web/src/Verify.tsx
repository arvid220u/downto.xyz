import { navigate, Redirect, redirectTo } from "@gatsbyjs/reach-router";
import { useCallback, useRef, useEffect, useState } from "react";

function Verify() {
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const email = params.get("u");
    const key = params.get("k");
    const dtf = params.get("dtf");
    const dtc = params.get("dtc");
    const dtd = params.get("dtd");
    window.history.replaceState(null, "", "");
    window.localStorage.setItem("email", email || "");
    window.localStorage.setItem("key", key || "");
    navigate(
      `/?dtf=${dtf ? encodeURIComponent(dtf) : ""}
      &dtc=${dtc ? encodeURIComponent(dtc) : ""}
      &dtd=${dtd ? encodeURIComponent(dtd) : ""}
      `
    );
  }, []);
  return <div>Redirecting...</div>;
}

export default Verify;
