import {createAction} from 'typesafe-actions';
import {Dispatch} from 'redux';
import {apiHostUrl} from '../../httpClient';
import {SourceChannel} from 'model';

const SET_CURRENT_SOURCE_CHANNELS = '@@channel/SET_SOURCE_CHANNELS';

export const setCurrentSourceChannelsAction = createAction(
  SET_CURRENT_SOURCE_CHANNELS,
  (channels: SourceChannel[]) => channels
)<SourceChannel[]>();

export const listSourceChannels = () => async (dispatch: Dispatch<any>) =>
  postDataToSourceAPI('sources.channels.list', null).then(response => {
    return Promise.resolve(response);
  });

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
