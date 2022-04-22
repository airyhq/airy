import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/webhook';
import {Webhook} from 'model/Webhook';

type Action = ActionType<typeof actions>;

const webhookReducer: any = (state = {}, action: Action): Webhook | {} => {
  switch (action.type) {
    case getType(actions.saveWebhooks):
      return {
        ...action.payload,
      };
    case getType(actions.enableWebhook):
      return {
        ...action.payload,
      };
    case getType(actions.disableWebhook):
      return {
        ...action.payload,
      };
    case getType(actions.changeWebhook):
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

export default webhookReducer;
