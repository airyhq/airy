import AiryWidget from "./AiryWidget";

const body = document.getElementsByTagName("body")[0];

const anchor = document.createElement("div");

anchor.style.cssText = `
position: fixed;
width: -webkit-fill-available;
width: -moz-available;
right: 0;
bottom: 0;
z-index: 9999;
max-height: 500px;
max-width: 300px;
padding: 0;
margin: 0;
color: #444;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
`;

body.appendChild(anchor);

new AiryWidget({
  // @ts-ignore
  channel_id: window.airy.cid
}).render(anchor);
