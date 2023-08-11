import {Channel} from 'model';
import {apiHostUrl} from '../../httpClient';
import {Base64} from 'js-base64';

export const createChannelForNewUser = (clientId: string, channel: Channel) => {
  if (channel) {
    // Channel Already Exists
    upsertConversations();
  } else {
    // Channel Does Not Exist
    postDataToSourceAPI('sources.channels.create', {
      source_channel_id: clientId,
      name: clientId,
      metadata: {},
    }).then(response => {
      upsertConversations();
    });
  }
};

const upsertConversations = () => {
  //loadGmailConversations(getEmail());
};

export const loadGmailConversations = (userId: string, nextPage?: string) => {
  let uri = `https://gmail.googleapis.com/gmail/v1/users/${userId}/threads?maxResults=500&includeSpamTrash=false`;
  if (nextPage) uri += `&pageToken`;
  return getData(uri)
    .then(response => {
      if (response.error && response.error.code === 401) {
        localStorage.removeItem('googleCredentials');
        localStorage.removeItem('googleUserCredentials');
        localStorage.removeItem('googleUserInfo');
        window.location.reload();
        return Promise.resolve();
      }
      response.threads.forEach(thread => {
        loadGmailConversation(userId, thread.id);
      });
    })
    .catch(error => {
      return Promise.reject(`Error: ${error}`);
    });
};

export const loadGmailConversation = (userId: string, threadId: string) => {
  return getData(`https://gmail.googleapis.com/gmail/v1/users/${userId}/threads/${threadId}`).then(response => {
    processMessages(response);
  });
};

const ingestConversation = conversation => {
  postDataToSourceAPI('sources.webhook', conversation).then(response => {
    console.log(response);
  });
};

const processMessages = response => {
  const messages = [];
  response.messages.forEach(message => {
    if (message) {
      const proccessedPayload = processPayload(response, message);
      if (proccessedPayload) messages.push(proccessedPayload);
    }
  });
  if (!!messages.length) {
    const conversation = {
      messages,
      metadata: [
        {
          namespace: 'conversation',
          source_id: '5f07cb3f-7240-5ebd-b314-0f215d8886a2',
          metadata: {
            contact: {
              display_name: extractFromEmail(response.messages[0].payload.headers),
            },
          },
        },
      ],
    };
    ingestConversation(conversation);
  }
};

const processPayload = (response, message) => {
  const payload = message.payload;
  const mimeType = payload.mimeType;
  if (mimeType === 'text/plain') {
    try {
      const text = Base64.decode(payload.body.data);
      return {
        source_message_id: message.id,
        source_conversation_id: response.id,
        source_channel_id: getEmail(),
        source_sender_id: extractFromEmail(payload.headers),
        content: {
          text: text,
        },
        from_contact: isInboundMessage(),
        sent_at: Number(message.internalDate),
      };
    } catch (e) {
      console.error(payload);
    }
  } else if (mimeType === 'text/html') {
    try {
      const html = Base64.decode(payload.body.data);
      return {
        source_message_id: message.id,
        source_conversation_id: response.id,
        source_channel_id: getEmail(),
        source_sender_id: extractFromEmail(payload.headers),
        content: {
          html: html,
        },
        from_contact: isInboundMessage(),
        sent_at: Number(message.internalDate),
      };
    } catch (e) {
      console.error(payload);
    }
  } else if (mimeType === 'multipart/alternative') {
    try {
      let text = '';
      let html = '';
      payload.parts.forEach(part => {
        if (part.mimeType === 'text/plain') {
          text = Base64.decode(part.body.data);
        } else if (part.mimeType === 'text/html') {
          html = Base64.decode(part.body.data);
        }
      });
      return {
        source_message_id: message.id,
        source_conversation_id: response.id,
        source_channel_id: getEmail(),
        source_sender_id: extractFromEmail(payload.headers),
        content: {
          text: text,
          html: html,
        },
        from_contact: isInboundMessage(),
        sent_at: Number(message.internalDate),
      };
    } catch (e) {
      console.error(payload);
    }
  } else if (mimeType === 'multipart/mixed') {
    try {
    } catch (e) {
      console.error(payload);
    }
  } else if (mimeType === 'multipart/related') {
    try {
    } catch (e) {
      console.error(payload);
    }
  } else if (mimeType.includes('application')) {
    try {
    } catch (e) {
      console.error(payload);
    }
  }
};

const isInboundMessage = (fromEmail?: string) => {
  if (fromEmail) return fromEmail.trim() !== getEmail().trim();
  return true;
};

const extractFromEmail = (headers: {name: string; value: string}[]) => {
  const headerList = headers.filter(header => header.name === 'From');
  if (headerList.length!!) {
    return headerList[0].value.split('<')[1].replace('>', '');
  }
  return 'Not found';
};

const getEmail = () => {
  return JSON.parse(localStorage.getItem('googleUserInfo'))['email'];
};

async function getData(url: string) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('googleCredentials'))['access_token']} `,
      'Content-type': 'application/json',
    },
  });
  return response.json();
}

async function postDataToSourceAPI(url: string, body: any) {
  const response = await fetch(apiHostUrl + '/' + url, {
    method: 'POST',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZGIyOTc0Yi1mM2YwLTQ3MTgtOGFkNS1hYzMzNWVlNTdkZTIiLCJzdWIiOiJzb3VyY2VfYXBwOmdvb2dsZXByb2ZpbGVzIiwiaWF0IjoxNjkwMzU5OTA2LCJwcmluY2lwYWwiOiJ7XCJuYW1lXCI6XCJzb3VyY2VfYXBwOmdvb2dsZXByb2ZpbGVzXCIsXCJkYXRhXCI6e1wic291cmNlXCI6XCJnb29nbGVwcm9maWxlc1wifSxcInJvbGVzXCI6bnVsbH0ifQ.hltbM7sX5fPYuww7OD0UbYcW-tTUMT1DdX6ws16W1Fo',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  try {
    return await response.json();
  } catch (e) {
    console.log(e);
    return;
  }
}
