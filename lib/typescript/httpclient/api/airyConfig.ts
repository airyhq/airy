import {getAuthToken} from './webStore';

export class AiryConfig {
  static API_URL = 'http://api.airy';
  static NODE_ENV = process.env.NODE_ENV;
  static FACEBOOK_APP_ID = 'CHANGE_ME';
}

const headers = {
  Accept: 'application/json',
};

export const doFetchFromBackend = async (url: string, body?: Object): Promise<any> => {
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = token;
  }

  if (!(body instanceof FormData)) {
    if (!isString(body)) {
      body = JSON.stringify(body);
    }
    headers['Content-Type'] = 'application/json';
  }

  const response: Response = await fetch(`${AiryConfig.API_URL}/${url}`, {
    method: 'POST',
    headers: headers,
    body: body as BodyInit,
  });

  return parseBody(response);
};

async function parseBody(response: Response): Promise<any> {
  if (response.ok) {
    return response.json();
  }

  let body = await response.text();
  if (body.length > 0) {
    body = JSON.parse(body);
  }

  const errorResponse = {
    status: response.status,
    body: body,
  };

  throw errorResponse;
}

function isString(object: any) {
  return typeof object === 'string' || object instanceof String;
}
