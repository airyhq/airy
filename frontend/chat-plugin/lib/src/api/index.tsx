import {
  FileContent,
  QuickReplyCommand,
  SimpleAttachment,
  SimpleAttachmentPayload,
  SuggestionResponse,
  TextContent,
  VideoContent,
} from 'render/providers/chatplugin/chatPluginModel';
import {ImageContent} from 'render/providers/twilio/twilioModel';
import {resetStorage, setResumeTokenInStorage} from '../storage';

let host;
export const setApiHost = apiHost => {
  host = apiHost;
};

export const sendMessage = (
  message: TextContent | SimpleAttachmentPayload | SuggestionResponse | QuickReplyCommand,
  token: string
) => {
  console.log('message: ', message);

  return fetch(`${host}/chatplugin.send`, {
    method: 'POST',
    body: JSON.stringify(convertToBody(message)),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const convertToBody = (message: TextContent | SimpleAttachmentPayload | SuggestionResponse | QuickReplyCommand) => {
  if (message.type == ('suggestionResponse' || 'quickReplies') && 'text' in message) {
    return {
      message: {
        text: message.text,
        postbackData: message.postbackData,
      },
    };
  }

  console.log('MESSAGE: ', message);

  if (message.type == 'image' || message.type == 'video' || (message.type == 'file' && 'url' in message)) {
    return {
      message: {
        attachment: {
          type: message.type,
          payload: {
            url: message.url,
          },
        },
      },
    };
  }

  if ('text' in message) {
    return {
      message: {
        text: message.text,
      },
    };
  }
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

export const authenticate = async (channelId: string, resumeToken?: string) =>
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
      // Get a fresh conversation in case the resume token expired
      if (resumeToken) {
        resetStorage(channelId);
        return authenticate(channelId);
      }
      return Promise.reject(
        new Error(`Airy Chat Plugin authentication failed. Please check your installation. ${error}`)
      );
    });

export const uploadMedia = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(`${host}/media.upload`, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(response => {
      return response.media_url;
    })
    .catch((err: Error) => {
      console.error(err);
    });
};
