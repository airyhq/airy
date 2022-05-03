import {
  SubscribeWebhookRequestPayload,
  UnsubscribeWebhookRequestPayload,
  UpdateWebhookRequestPayload,
} from 'httpclient/src';
import {Webhook} from 'model/Webhook';
import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';

import {HttpClientInstance} from '../../httpClient';

const ADD_WEBHOOKS_TO_STORE = 'ADD_WEBHOOKS_TO_STORE';
const SUBSCRIBE_WEBHOOK = 'SUBSCRIBE_WEBHOOK';
const UNSUBSCRIBE_WEBHOOK = 'UNSUBSCRIBE_WEBHOOK';
const UPDATE_WEBHOOK = 'UPDATE_WEBHOOK';

export const saveWebhooks = createAction(ADD_WEBHOOKS_TO_STORE, (webhook: Webhook[]) => webhook)<Webhook[]>();
export const enableWebhook = createAction(SUBSCRIBE_WEBHOOK, (webhook: Webhook) => webhook)<Webhook>();
export const disableWebhook = createAction(UNSUBSCRIBE_WEBHOOK, (webhook: Webhook) => webhook)<Webhook>();
export const changeWebhook = createAction(UPDATE_WEBHOOK, (webhook: Webhook) => webhook)<Webhook>();

export const listWebhooks = () => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.listWebhooks().then((response: Webhook[]) => {
    dispatch(saveWebhooks(response));
    return Promise.resolve(true);
  });
};

export const subscribeWebhook = (request: SubscribeWebhookRequestPayload) => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.subscribeWebhook(request).then((response: Webhook) => {
    dispatch(enableWebhook(response));
    return Promise.resolve(true);
  });
};

export const unsubscribeWebhook = (request: UnsubscribeWebhookRequestPayload) => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.unsubscribeWebhook(request).then((response: Webhook) => {
    dispatch(disableWebhook(response));
    return Promise.resolve(true);
  });
};

export const updateWebhook = (request: UpdateWebhookRequestPayload) => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.updateWebhook(request).then((response: Webhook) => {
    dispatch(changeWebhook(response));
    return Promise.resolve(true);
  });
};
