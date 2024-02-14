import _typesafe, {createAction} from 'typesafe-actions';
import {apiHostUrl, HttpClientInstance} from '../../httpClient';
import {Dispatch} from 'react';
import {Stream, StreamInfo} from 'model';
import {Schema} from 'react-markdown/lib/ast-to-react';
import {CreateStreamPayload} from 'httpclient/src';

const SET_TOPICS = '@@metadata/SET_TOPICS';
const SET_TOPIC_INFO = '@@metadata/SET_TOPIC_INFO';
const SET_TOPIC_SCHEMAS = '@@metadata/SET_TOPIC_SCHEMAS';
const SET_STREAMS = '@@metadata/SET_STREAMS';
const SET_SCHEMAS_INFO = '@@metadata/SET_SCHEMAS_INFO';
const SET_SCHEMAS_VERSIONS = '@@metadata/SET_SCHEMAS_VERSIONS';
const SET_STREAM_INFO = '@@metadata/SET_STREAM_INFO';
const SET_LAST_MESSAGE = '@@metadata/SET_LAST_MESSAGRE';

// ------------------------- STREAMS -------------------------

export const getStreams = () => (dispatch: Dispatch<any>) => {
  return HttpClientInstance.getStreams().then((response: Stream[]) => {
    dispatch(setStreamsAction(response));
    return Promise.resolve(true);
  });
};

export const getStreamInfo = (name: string) => (dispatch: Dispatch<any>) => {
  return HttpClientInstance.getStreamInfo({name}).then((response: any) => {
    dispatch(setCurrentStreamInfoAction(response));
    return Promise.resolve(true);
  });
};

export const createStream = (payload: CreateStreamPayload) => () => {
  return HttpClientInstance.createStream(payload)
    .then(() => {
      return Promise.resolve(true);
    })
    .catch(e => {
      console.error(e);
    });
};

export const deleteStream = (name: string) => () => {
  return HttpClientInstance.deleteStream({name})
    .then(() => {
      return Promise.resolve(true);
    })
    .catch(e => {
      console.error(e);
    });
};

// ------------------------- TOPICS -------------------------

export const getTopics = () => async (dispatch: Dispatch<any>) => {
  return getData('topics').then(response => {
    dispatch(setTopicsAction(response));
    return Promise.resolve(true);
  });
};

export const getTopicInfo = (topicName: string) => async (dispatch: Dispatch<any>) => {
  return getData(`topics/${topicName}`).then(response => {
    dispatch(setTopicInfoAction(response));
    return Promise.resolve(true);
  });
};

// ------------------------- SCHEMAS -------------------------

export const getSchemas = () => async (dispatch: Dispatch<any>) => {
  return getData('schemas.list').then(response => {
    console.log(response);
    dispatch(setTopicSchemasAction(response));
    return Promise.resolve(true);
  });
};

export const getSchemaVersions = (topicName: string) => async (dispatch: Dispatch<any>) => {
  return getData(`schemas.versions?topicName=${topicName}`).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    } else {
      dispatch(setCurrentSchemaVersionsAction({name: topicName, versions: response}));
    }
    return Promise.resolve(true);
  });
};

export const getSchemaInfo = (topicName: string, version?: string) => async (dispatch: Dispatch<any>) => {
  let v = 'latest';
  if (version) {
    v = version;
  }
  return getData(`schemas.info?topicName=${topicName}&version=${v}`).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    } else {
      dispatch(setCurrentSchemaInfoAction(response));
    }
    return Promise.resolve(true);
  });
};

export const setSchemaSchema = (topicName: string, schema: string) => async () => {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(`schemas.update?topicName=${topicName}`, body).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    if (response.id) return Promise.resolve(true);
    if (response.message) return Promise.reject(response.message);
    return Promise.reject('Unknown Error');
  });
};

export const createSchema = (topicName: string, schema: string) => async () => {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(`schemas.create?topicName=${topicName}`, body)
    .then(response => {
      if (response.id) return Promise.resolve(true);
      if (response.message) return Promise.reject(response.message);
      return Promise.reject('Unknown Error');
    })
    .catch(e => {
      return Promise.reject(e);
    });
};

export const checkCompatibilityOfNewSchema = (topicName: string, schema: string, version: number) => async () => {
  const body = {
    schema: JSON.stringify({...JSON.parse(schema)}),
  };
  return postData(`schemas.compatibility?topicName=${topicName}&version=${version}`, body)
    .then(response => {
      if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
        return Promise.reject('404 Not Found');
      }
      if (response.is_compatible !== undefined) {
        if (response.is_compatible === true) {
          return Promise.resolve(true);
        }
        return Promise.reject('Schema Not Compatible');
      }
      if (response.message) return Promise.reject(response.message);
      return Promise.reject('Unknown Error');
    })
    .catch(e => {
      return Promise.reject(e);
    });
};

export const deleteSchema = (topicName: string) => async () => {
  return deleteData(`schemas.delete?topicName=${topicName}`).then(response => {
    if (response.error_code && response.error_code.toString().includes('404') && !topicName.includes('-value')) {
      return Promise.reject('404 Not Found');
    }
    return Promise.resolve(true);
  });
};

export const getLastMessage = (topicName: string) => async (dispatch: Dispatch<any>) => {
  return getData(`schemas.lastMessage?topicName=${topicName}`).then(response => {
    dispatch(setLastMessage(response));
    return Promise.resolve(true);
  });
};

// -------------------------  API -------------------------

async function getData(url: string) {
  const response = await fetch(apiHostUrl + '/' + url, {
    method: 'GET',
  });
  return response.json();
}

async function deleteData(url: string) {
  const response = await fetch(apiHostUrl + '/' + url, {
    method: 'DELETE',
  });
  return response.json();
}

async function postData(url: string, body: any) {
  const response = await fetch(apiHostUrl + '/' + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

// -------------------------  ACTIONS -------------------------

export const setTopicsAction = createAction(SET_TOPICS, (topics: string[]) => topics)<string[]>();

export const setTopicInfoAction = createAction(SET_TOPIC_INFO, (topicInfo: Schema) => topicInfo)<Schema>();

export const setTopicSchemasAction = createAction(SET_TOPIC_SCHEMAS, (topics: string[]) => topics)<string[]>();

export const setStreamsAction = createAction(SET_STREAMS, (streams: Stream[]) => streams)<Stream[]>();

export const setCurrentSchemaInfoAction = createAction(SET_SCHEMAS_INFO, (topicInfo: Schema) => topicInfo)<Schema>();

export const setCurrentSchemaVersionsAction = createAction(
  SET_SCHEMAS_VERSIONS,
  (topicInfo: {name: string; versions: []}) => topicInfo
)<{name: string; versions: []}>();

export const setCurrentStreamInfoAction = createAction(
  SET_STREAM_INFO,
  (streamInfo: StreamInfo) => streamInfo
)<StreamInfo>();

export const setLastMessage = createAction(SET_LAST_MESSAGE, (message: {}) => message)<{}>();
