(this.webpackJsonpweb=this.webpackJsonpweb||[]).push([[0],{18:function(e,t,n){},20:function(e,t,n){},25:function(e,t,n){"use strict";n.r(t);var a,o=n(0),r=n.n(o),c=n(13),s=n.n(c),i=(n(18),n(11)),l=n(2),u=n.n(l),d=n(3),p=n(4),b=n(12),h=n(5),y=(n(20),n(1));function f(e,t){return m.apply(this,arguments)}function m(){return(m=Object(h.a)(u.a.mark((function e(t,n){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=Promise,e.t1=g,e.next=4,j(t,n);case 4:return e.t2=e.sent,e.t3=(0,e.t1)(e.t2),e.abrupt("return",e.t0.all.call(e.t0,e.t3));case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function j(e,t){return Promise.all(e.map(t))}function g(e){var t;return(t=[]).concat.apply(t,Object(b.a)(e))}var w="DTF",x="DTC",O="DTD",v=[w,x,O],k=(a={},Object(p.a)(a,w,"(fuck)"),Object(p.a)(a,x,"(cuddle)"),Object(p.a)(a,O,"(date)"),a);function S(e){for(var t="",n=new Uint8Array(e),a=n.byteLength,o=0;o<a;o++)t+=String.fromCharCode(n[o]);return window.btoa(t)}function A(e){for(var t=window.atob(e),n=t.length,a=new Uint8Array(n),o=0;o<n;o++)a[o]=t.charCodeAt(o);return a.buffer}function N(){return Object(y.jsx)("footer",{children:Object(y.jsxs)("div",{className:"my-2 max-w-2xl mx-auto",children:[Object(y.jsx)("h3",{className:"font-bold text-lg",children:"how does it work?"}),Object(y.jsx)("p",{className:"m-2",children:"you enter the @mit.edu addresses of people you are down to do things with. if you both indicate interest in each other for the same category, you will both get an email notifying you of a match!"}),Object(y.jsx)("h3",{className:"font-bold text-lg",children:"privacy"}),Object(y.jsx)("p",{className:"m-2",children:"the data stored on our servers is encrypted, so you don't need to worry about your list of preferences being revealed at any point (assuming you trust somewhat rushed unaudited untested code). information is only revealed in the event of a match. a slightly unfortunate side effect of this, and the fact that MIT does not have a public key directory, is that a match will not be detected if person A enters their preferences for B before B has verified their email, until person A comes back to this page and updates."}),Object(y.jsxs)("p",{className:"m-2",children:["the source code is available at"," ",Object(y.jsx)("a",{href:"https://github.com/arvid220u/downto.xyz",children:"github.com/arvid220u/downto.xyz"}),". the readme contains a more thorough description of the exact privacy protocol. feedback and pull requests are very welcome!"]}),Object(y.jsx)("h3",{className:"font-bold text-lg",children:"about"}),Object(y.jsx)("p",{className:"m-2",children:"downto.xyz is inspired by the now-dead dildo.io. we believe that there should be fewer taboos, more openness and more physical intimacy in the world. while downto.xyz obviously isn't the end-all-be-all solution to any of that, we hope that it can contribute to a more open world, even if only by a tiny amount."}),Object(y.jsx)("p",{className:"m-2",children:"if you have any thoughts, positive or negative, email us at downto-board@mit.edu. it is very important to us that downto.xyz is good for the world, not bad, and if you have any concerns about anything, please let us know."})]})})}function C(){return K.apply(this,arguments)}function K(){return K=Object(h.a)(u.a.mark((function e(){var t,n,a,o,r=arguments;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=r.length>0&&void 0!==r[0]?r[0]:"",n=r.length>1&&void 0!==r[1]?r[1]:{},a="https://api.downto.xyz"+t,console.log(a),e.next=6,fetch(a,{method:"POST",cache:"no-cache",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});case 6:return o=e.sent,console.log(o),e.abrupt("return",o);case 9:case"end":return e.stop()}}),e)}))),K.apply(this,arguments)}function I(e){var t=e.match(/([^,\s@]+@\w+\.\w+)/gm);return t||[]}function E(e){var t=window.localStorage.getItem("email"),n=window.localStorage.getItem("key"),a=null!=t&&null!=n,r=Object(o.useState)(a?t:""),c=Object(d.a)(r,2),s=c[0],l=c[1],m=Object(o.useState)(null),j=Object(d.a)(m,2),g=j[0],w=j[1],x=Object(o.useState)(""),O=Object(d.a)(x,2),N=O[0],K=O[1],E=Object(o.useState)(""),R=Object(d.a)(E,2),U=R[0],P=R[1],T=Object(o.useState)(!1),H=Object(d.a)(T,2),L=H[0],z=H[1],D=Object(o.useState)(e.targets),F=Object(d.a)(D,2),B=F[0],J=F[1];Object(o.useEffect)((function(){J(e.targets)}),[e.targets]);var _=Object(o.useCallback)(Object(h.a)(u.a.mark((function e(){var o,r,c,s,i,l;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a){e.next=3;break}return alert("you must verify your email first!"),e.abrupt("return");case 3:if(g&&g.privateKey){e.next=6;break}return alert("you need to either paste an old key or generate a new key!"),e.abrupt("return");case 6:if(L){e.next=9;break}return alert("please indicate that you are honest and serious by clicking the checkbox."),e.abrupt("return");case 9:for(c in console.log("update :0"),o=[],r=function(e){o.push.apply(o,Object(b.a)(I(B[e]).map((function(t){return[e,t]}))))},B)r(c);return console.log(o),e.next=16,C("/getsecrets",{sessionkey:n,email:t,emails:o.map((function(e){return e[1]}))});case 16:return s=e.sent,console.log(s.json()),e.next=20,f(o,function(){var e=Object(h.a)(u.a.mark((function e(n){var a,o,r,c,i,l,p,b,h,y,f,m,j,w,x,O,v,k,N,C,K,I,E,R,U,P;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=n[1],o=n[0],g.privateKey&&g.publicKey){e.next=5;break}return alert("somethingw rong"),e.abrupt("return",[]);case 5:r=s.json()[a],c=[r.sk1,r.sk2],i=[],l=0,p=c;case 9:if(!(l<p.length)){e.next=73;break}return b=p[l],y=(h=a>t?t:a)===a?t:a,f="".concat(o).concat(h).concat(y),m=new TextEncoder,j=new TextDecoder,console.log(r),e.next=19,crypto.subtle.digest("SHA-256",m.encode(f));case 19:return w=e.sent,console.log("HASH:"),console.log(w),x="",e.prev=23,console.log("encrypted SK:"),console.log(b),console.log("public key: "),e.t0=console,e.t1=S,e.next=31,crypto.subtle.exportKey("spki",g.publicKey);case 31:return e.t2=e.sent,e.t3=(0,e.t1)(e.t2),e.t0.log.call(e.t0,e.t3),e.next=36,crypto.subtle.decrypt({name:"RSA-OAEP"},g.privateKey,A(b));case 36:O=e.sent,console.log("SKA AND NONCE:"),console.log(O),x=j.decode(O),e.next=48;break;case 42:return e.prev=42,e.t4=e.catch(23),console.log("ERROR (ignoring it)....."),console.log(e.t4),i.push({identifier:"fakeidentifier",nonce:"fakenonce",email0:h,email1:y,type:o}),e.abrupt("continue",70);case 48:if(console.log("SK AND NONCE S: "),console.log(x),v=x.split("!"),k=Object(d.a)(v,2),N=k[0],C=k[1],K=A(N),w.byteLength===K.byteLength){e.next=58;break}return alert("smth very wrong"),console.log(w),console.log(K),i.push({identifier:"fakeidentifier",nonce:"fakenonce",email0:h,email1:y,type:o}),e.abrupt("continue",70);case 58:for(console.log("SK"),console.log(j.decode(K)),console.log("H_HASH"),console.log(j.decode(w)),I=new Uint8Array(K),E=new Uint8Array(w),R=new Uint8Array(K.byteLength),U=0;U<R.length;U++)R[U]=I[U]^E[U],console.log("sk[".concat(U,"] = ").concat(K[U],", h_hash[]=").concat(w[U],", id1[]=").concat(R[U]));console.log("id1"),console.log(j.decode(R)),P=S(R),i.push({identifier:P,nonce:C,email0:h,email1:y,type:o});case 70:l++,e.next=9;break;case 73:return e.abrupt("return",i);case 74:case"end":return e.stop()}}),e,null,[[23,42]])})));return function(t){return e.apply(this,arguments)}}());case 20:return i=e.sent,console.log(i),e.next=24,C("/update",{sessionkey:n,email:t,publickey:N,likes:i});case 24:(l=e.sent).ok?alert("successfully updated preferences! check your email (and in particular your junk folder)"):alert("unsuccessful update: ".concat(l.statusText));case 26:case"end":return e.stop()}}),e)}))),[s,U,B,a,n,t,L,N,g]),M=Object(o.useCallback)((function(){window.localStorage.removeItem("email"),window.localStorage.removeItem("key"),l("")}),[]),q=Object(o.useCallback)(Object(h.a)(u.a.mark((function e(){var t,n,a,o,r,c,s;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return P("...generating key..."),alert("save this key! you need to use the same key every time"),e.next=4,crypto.subtle.generateKey({name:"RSA-OAEP",modulusLength:4096,publicExponent:new Uint8Array([1,0,1]),hash:"SHA-256"},!0,["encrypt","decrypt"]);case 4:if(t=e.sent,w(t),t.publicKey&&t.privateKey){e.next=9;break}return alert("error :("),e.abrupt("return");case 9:return e.next=11,crypto.subtle.exportKey("spki",t.publicKey);case 11:return n=e.sent,a=S(n),K(a),console.log(a),e.next=17,crypto.subtle.exportKey("pkcs8",t.privateKey);case 17:o=e.sent,r=S(o),console.log(r),c=new Uint8Array(10),c=crypto.getRandomValues(c),s="".concat(S(c),"!").concat(a,"!").concat(r),P(s),window.localStorage.setItem("keypair",s);case 25:case"end":return e.stop()}}),e)}))),[]),V=Object(o.useCallback)(function(){var e=Object(h.a)(u.a.mark((function e(t){var n,a,o,r,c,s;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,P(t),n=t.split("!"),a=Object(d.a)(n,3),a[0],o=a[1],r=a[2],e.next=5,crypto.subtle.importKey("spki",A(o),{name:"RSA-OAEP",hash:"SHA-256"},!0,["encrypt"]);case 5:return c=e.sent,e.next=8,crypto.subtle.importKey("pkcs8",A(r),{name:"RSA-OAEP",hash:"SHA-256"},!0,["decrypt"]);case 8:s=e.sent,K(o),w({privateKey:s,publicKey:c}),window.localStorage.setItem("keypair",t),e.next=18;break;case 14:e.prev=14,e.t0=e.catch(0),P(U),alert("invalid key: ".concat(e.t0));case 18:case"end":return e.stop()}}),e,null,[[0,14]])})));return function(t){return e.apply(this,arguments)}}(),[U,g,P,K,w]),G=Object(o.useCallback)(Object(h.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s.match(/[a-z0-9_]+@mit\.edu/gm)){e.next=3;break}return alert("you need to send from an mit.edu email address!"),e.abrupt("return");case 3:C("/verify",{email:s,targets:B}),alert("check your email (including your junk folder) for a verification link!");case 6:case"end":return e.stop()}}),e)}))),[s,B]);return Object(o.useEffect)((function(){var e=window.localStorage.getItem("keypair");e!==U&&V(e)}),[]),Object(y.jsxs)("div",{className:"Send mb-4 mx-4",children:[Object(y.jsxs)("div",{className:"inputrow",children:[Object(y.jsx)("input",{type:"email",value:s,onChange:function(e){return l(e.target.value)},placeholder:"mykerb@mit.edu",readOnly:a}),Object(y.jsx)("button",{onClick:function(){return a?M():G()},children:a?"change":"verify"})]}),Object(y.jsxs)("div",{className:"inputrow",children:[Object(y.jsx)("input",{type:"text",value:U,placeholder:"paste old key here, or generate new ",onChange:function(e){return V(e.target.value)}}),Object(y.jsx)("button",{onClick:q,children:"generate"})]}),v.map((function(e){return Object(y.jsxs)("div",{className:"inputrow",children:[Object(y.jsxs)("div",{className:"my-auto mx-auto mr-2 w-20",children:[Object(y.jsxs)("span",{className:"font-bold text-lg",children:[e,":"]},"".concat(e,"3")),Object(y.jsx)("br",{},"".concat(e,"4")),Object(y.jsx)("span",{className:"text-xs",children:k[e]},"".concat(e,"5"))]},"".concat(e,"2")),Object(y.jsx)("textarea",{className:"inputrow",placeholder:"friend@mit.edu, friend2@mit.edu",value:B[e],onChange:function(t){return J(Object(i.a)(Object(i.a)({},B),{},Object(p.a)({},e,t.target.value)))}},"".concat(e,"6"))]},"".concat(e,"1"))})),Object(y.jsxs)("div",{children:[Object(y.jsx)("input",{className:"w-3 h-3 border border-gray-300 rounded",type:"checkbox",name:"solemnlyswear",checked:L,onClick:function(){return z(!L)}})," ",Object(y.jsx)("label",{htmlFor:"solemnlyswear",children:"i hereby declare that i am excited to do things with the people above, should we match"})]}),Object(y.jsx)("button",{onClick:_,children:"update"}),Object(y.jsx)("div",{children:"(note: you can only update once every 24 hours!)"}),"(note 2: emails are sent immediately upon a match! so please, if so only to avoid awkwardness, be honest. seriously)"]})}var R=function(e){var t=Object(o.useState)("normal"),n=Object(d.a)(t,2),a=n[0],r=(n[1],Object(o.useState)({})),c=Object(d.a)(r,2),s=c[0],i=c[1];return Object(o.useEffect)((function(){var e,t=window.location.search,n=new URLSearchParams(t),a=n.get("dtf"),o=n.get("dtc"),r=n.get("dtd");i((e={},Object(p.a)(e,w,a||""),Object(p.a)(e,x,o||""),Object(p.a)(e,O,r||""),e)),window.history.replaceState({},document.title,window.location.pathname)}),[a]),Object(y.jsxs)("div",{className:"App",children:[Object(y.jsx)("h1",{className:"font-bold text-xl m-2",children:"downto.xyz"}),Object(y.jsx)(E,{targets:s}),Object(y.jsx)("hr",{}),Object(y.jsx)(N,{})]})},U=n(9);var P=function(e){return Object(o.useEffect)((function(){var e=window.location.search,t=new URLSearchParams(e),n=t.get("u"),a=t.get("k"),o=t.get("dtf"),r=t.get("dtc"),c=t.get("dtd");window.history.replaceState(null,"",""),window.localStorage.setItem("email",n||""),window.localStorage.setItem("key",a||""),Object(U.b)("/?dtf=".concat(o?encodeURIComponent(o):"","&dtc=").concat(r?encodeURIComponent(r):"","&dtd=").concat(c?encodeURIComponent(c):""))}),[]),Object(y.jsx)("div",{children:"Redirecting..."})},T=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,26)).then((function(t){var n=t.getCLS,a=t.getFID,o=t.getFCP,r=t.getLCP,c=t.getTTFB;n(e),a(e),o(e),r(e),c(e)}))};s.a.render(Object(y.jsx)(r.a.StrictMode,{children:Object(y.jsxs)(U.a,{children:[Object(y.jsx)(R,{path:"/"}),Object(y.jsx)(P,{path:"/verify"})]})}),document.getElementById("root")),T(null)}},[[25,1,2]]]);
//# sourceMappingURL=main.81c93177.chunk.js.map