import AiryWidget from './AiryWidget';
import {Config} from './App';

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
    config?: Config;
  };
};

if (window.airy.channelId) {
  new AiryWidget({
    channelId: window.airy.channelId,
    config: window.airy.config,
  }).render(anchor);
} else {
  console.log(
    'The Airy Chat Plugin is missing the channel id parameter. Please check the docs at http://docs.airy.co to find out more.'
  );
}
