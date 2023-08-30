import {Channel} from 'model';
import {apiHostUrl} from '../../httpClient';

export const createChannelForNewUser = (clientId: string, channel: Channel) => {
  if (channel) {
    // Channel Already Exists
    connectAccount()
  } else {
    // Channel Does Not Exist
    postData('sources.channels.create', {
      source_channel_id: clientId,
      name: clientId,
      metadata: {},
    }, true).then(() => {
      connectAccount()
    });
  }
};

const connectAccount = () => {
  postData('gmail.account', {
    userId: getGmailEmail(),
    refreshToken: getGmailRefreshToken()
  }).catch(e => {
    console.log(e)
  })
}

export const getGmailEmail = () => {
  return JSON.parse(localStorage.getItem('googleUserInfo'))['email'];
};

const getGmailRefreshToken = () => {
  return JSON.parse(localStorage.getItem('googleCredentials'))['refresh_token'];
};

async function postData(url: string, body: any, isSourceAPI: boolean = false) {

  console.log(body)


  const response = await fetch('http://localhost:3000' + '/' + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(isSourceAPI && {Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkZGIyOTc0Yi1mM2YwLTQ3MTgtOGFkNS1hYzMzNWVlNTdkZTIiLCJzdWIiOiJzb3VyY2VfYXBwOmdvb2dsZXByb2ZpbGVzIiwiaWF0IjoxNjkwMzU5OTA2LCJwcmluY2lwYWwiOiJ7XCJuYW1lXCI6XCJzb3VyY2VfYXBwOmdvb2dsZXByb2ZpbGVzXCIsXCJkYXRhXCI6e1wic291cmNlXCI6XCJnb29nbGVwcm9maWxlc1wifSxcInJvbGVzXCI6bnVsbH0ifQ.hltbM7sX5fPYuww7OD0UbYcW-tTUMT1DdX6ws16W1Fo'})
    },
    mode: 'no-cors',
    body: JSON.stringify(body),
  });

  try {
    return await response.json();
  } catch {
    return;
  }
}