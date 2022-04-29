import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/webhook';
import {Webhook} from 'model/Webhook';

type Action = ActionType<typeof actions>;

export type Webhooks = {
  [id: string]: Webhook;
};

const setWebhook = (state: Webhooks, webhook: Webhook) => {
  console.log('A', state[webhook.id]);
  console.log('B', state[webhook.id]?.id);
  console.log('C', webhook.id);
  console.log('D', state);

  return {
    ...state,
    [webhook.id]: {
      ...webhook,
      id: state[webhook.id]?.id,
      url: state[webhook.id]?.url,
      name: state[webhook.id]?.name,
      events: state[webhook.id]?.events,
      status: state[webhook.id]?.status,
      headers: state[webhook.id]?.headers,
      signatureKey: state[webhook.id]?.signatureKey,
    },
  };
};

const webhookReducer: any = (state = {}, action: Action) => {
  switch (action.type) {
    case getType(actions.saveWebhooks):
      return {
        ...state,
        ...action.payload,
      };
    case getType(actions.enableWebhook):
      console.log('action payload subscribe: ', action.payload);
      return {
        ...state,
        [0]: {
          ...action.payload,
        },
      };
    case getType(actions.disableWebhook):
      console.log('action payload unsubscribe: ', action.payload);
      console.log('STATE: ', state);

      return {
        ...state,
        [0]: {
          ...action.payload,
        },
      };
    case getType(actions.changeWebhook):
      console.log('action payload update: ', action.payload);
      return {
        ...state,
        [0]: {
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default webhookReducer;
