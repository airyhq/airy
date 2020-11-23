import { getAuthToken } from "./webStore";

export class AiryConfig {
  static API_URL = "http://api.airy";
  static NODE_ENV = process.env.NODE_ENV;
}

const headers = {
  Accept: "application/json"
};

export const doFetchFromBackend = async (
  url: string,
  body?: Object,
  retryCount: number = 0
): Promise<any> => {
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = token;
  }

  if (!(body instanceof FormData)) {
    if (!isString(body)) {
      body = JSON.stringify(body);
    }
    headers["Content-Type"] = "application/json";
  }

  try {
    const response: Response = await fetch(`${AiryConfig.API_URL}/${url}`, {
      method: "POST",
      headers: headers,
      body: body as BodyInit
    });

    return parseBody(response);
  } catch (error) {
    return error;
  }
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
    body: body
  };

  throw errorResponse;
}

function isString(object: any) {
  return typeof object === "string" || object instanceof String;
}
