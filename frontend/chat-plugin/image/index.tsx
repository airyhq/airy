import React from 'react';
import {render} from 'react-dom';
import {AiryChatPlugin, Config} from 'chat-plugin';

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
        config?: Config;
    };
};

if (!window.airy.channelId) {
    console.error(
        'The Airy Chat Plugin is missing the channel id parameter. Please check the docs at http://docs.airy.co to find out more.'
    );
} else {
    render(<AiryChatPlugin config={{
        apiHost: window.airy.host,
        channelId: window.airy.channelId,
        resumeToken: window.airy.resumeToken,
        config: window.airy.config,
    }}/>, anchor);
}
