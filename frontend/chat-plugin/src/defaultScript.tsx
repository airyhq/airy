import AiryWidget from './AiryWidget';

const body = document.getElementsByTagName('body')[0];

const anchor = document.createElement('div');

anchor.style.cssText = `
position: fixed;
width: -webkit-fill-available;
width: -moz-available;
right: 0;
bottom: 0;
z-index: 9999;
height: 100vh;
max-height: 700px;
max-width: 380px;
padding: 0;
margin: 0;
color: #444;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
`;

body.appendChild(anchor);

declare const window: {
  airy: {
    host: string;
    channelId: string;
    resumeToken?: string;
    welcomeMessage: {};
  };
};

if (window.airy.channelId) {
  new AiryWidget({
    resumeToken: window.airy.resumeToken,
    channelId: window.airy.channelId,
    welcomeMessage: window.airy.welcomeMessage,
  }).render(anchor);
} else {
  console.log(
    'The Airy Chat Plugin is missing the channel id parameter. Please check the docs at http://docs.airy.co to find out more.'
  );
}
