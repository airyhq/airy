import {QuickReplyCommand, SuggestionResponse, TextContent} from 'render/providers/chatplugin/chatPluginModel';
import {setResumeTokenInStorage} from '../storage';

let host;
export const setApiHost = apiHost => {
  host = apiHost;
};

export const sendMessage = (message: TextContent | SuggestionResponse | QuickReplyCommand, token: string) => {
  return fetch(`${host}/chatplugin.send`, {
    method: 'POST',
    body: JSON.stringify(convertToBody(message)),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const convertToBody = (message: TextContent | SuggestionResponse | QuickReplyCommand) => {
  if (message.type == ('suggestionResponse' || 'quickReplies')) {
    return {
      message: {
        text: message.text,
        postbackData: message.postbackData,
      },
    };
  }

  return {
    message: {
      text: message.text,
    },
  };
};

export const getResumeToken = async (channelId: string, authToken: string) => {
  const resumeChat = await fetch(`${host}/chatplugin.resumeToken`, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
  const jsonResumeToken = await resumeChat.json();
  setResumeTokenInStorage(channelId, jsonResumeToken.resume_token);
};

export const authenticate = async (channelId: string, resumeToken: string) =>
  fetch(`${host}/chatplugin.authenticate`, {
    method: 'POST',
    body: JSON.stringify({
      channel_id: channelId,
      ...(resumeToken && {
        resume_token: resumeToken,
      }),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`/chatplugin.authenticate returned ${response.statusText}`));
      }
      return response.json();
    })
    .catch(error => {
      return Promise.reject(
        new Error(`Airy Chat Plugin authentication failed. Please check your installation. ${error}`)
      );
    });
