import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/webhook';
import {keyBy} from 'lodash-es';

type Action = ActionType<typeof actions>;

const webhookReducer: any = (state = {}, action: Action) => {
  switch (action.type) {
    case getType(actions.saveWebhooks):
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case getType(actions.enableWebhook):
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
        },
      };
    case getType(actions.disableWebhook):
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
        },
      };
    case getType(actions.changeWebhook):
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export default webhookReducer;
