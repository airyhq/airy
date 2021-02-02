import {Text} from 'types';

declare const window: {
  airy: {
    h: string;
    cid: string;
    no_tls: boolean;
  };
};

const API_HOST = window.airy ? window.airy.h : 'chatplugin.airy';

export const sendMessage = (message: Text, token: string) => {
  return fetch(`//${API_HOST}/chatplugin.send`, {
    method: 'POST',
    body: JSON.stringify({
      message,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getResumeToken = async (token: string) => {
  const resumeChat = await fetch(`//${API_HOST}/chatplugin.resumeToken`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  });
  const jsonResumeToken = await resumeChat.json();
  localStorage.setItem('resume_token', jsonResumeToken.resume_token);
};

export const start = async (channel_id: string, resume_token: string) => {
  try {
    const response = await fetch(`//${API_HOST}/chatplugin.authenticate`, {
      method: 'POST',
      body: JSON.stringify({
        channel_id: channel_id,
        ...(resume_token && {
          resume_token,
        }),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (e) {
    return Promise.reject(new Error('Widget authorization failed. Please check your installation.'));
  }
};
