import {ActionType, getType} from 'typesafe-actions';
import {Contact} from 'model';
import * as actions from '../../../actions/contacts';

type Action = ActionType<typeof actions>;

const initialState = {
  all: {},
};

export type Contacts = {
  all: {
    [conversationId: string]: Contact;
  };
};

const contactsReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case getType(actions.getContactsInfoAction):
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.conversationId]: action.payload.contactsInfo,
        },
      };
    case getType(actions.updateContactsInfoAction):
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.conversationId]: {
            ...state.all[action.payload.conversationId],
            ...action.payload.updatedContactsInfo,
          },
        },
      };

    default:
      return state;
  }
};

export default contactsReducer;
