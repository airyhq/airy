import {Channel} from 'model';
import {apiHostUrl} from '../../httpClient';

export const createChannelForNewUser = (clientId: string, channel: Channel) => {
  if (channel) {
    // Channel Already Exists
    upsertConversations();
  } else {
    console.log('channel does not exist: ', clientId);
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
  const userId = JSON.parse(localStorage.getItem('googleUserInfo'))['email'];
  const conversations = [];
  loadGmailConversations(userId);
  console.log('Conversations: ', conversations);
  //loadGmailConversation(userId, "189b1681d3e5b28b")
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
      loadGmailConversation(userId, response.threads[0].id);
    })
    .catch(error => {
      return Promise.reject(`Error: ${error}`);
    });
};

export const loadGmailConversation = (userId: string, threadId: string) => {
  return getData(`https://gmail.googleapis.com/gmail/v1/users/${userId}/threads/${threadId}`).then(response => {
    console.log(response);
    //console.log(JSON.stringify(response));
    console.log(response.messages[0].payload.parts[0].body.data);
    console.log(base64Decode(response.messages[0].payload.parts[0].body.data));
  });
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
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZGIyOTc0Yi1mM2YwLTQ3MTgtOGFkNS1hYzMzNWVlNTdkZTIiLCJzdWIiOiJzb3VyY2VfYXBwOmdvb2dsZXByb2ZpbGVzIiwiaWF0IjoxNjkwMzU5OTA2LCJwcmluY2lwYWwiOiJ7XCJuYW1lXCI6XCJzb3VyY2VfYXBwOmdvb2dsZXByb2ZpbGVzXCIsXCJkYXRhXCI6e1wic291cmNlXCI6XCJnb29nbGVwcm9maWxlc1wifSxcInJvbGVzXCI6bnVsbH0ifQ.hltbM7sX5fPYuww7OD0UbYcW-tTUMT1DdX6ws16W1Fo`,
      'Content-Type': 'application/vnd.schemaregistry.v1+json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

const base64Decode = str => {
  return str === null ? '' : decodeURIComponent(atob(str).replace(/\+/g, ' '));
};
