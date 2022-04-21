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
    case getType(actions.getContactDetailsAction):
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.conversationId]: action.payload.contact,
        },
      };
    case getType(actions.updateContactDetailsAction):
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.conversationId]: {
            ...state.all[action.payload.conversationId],
            ...action.payload.updatedContact,
          },
        },
      };

    default:
      return state;
  }
};

export default contactsReducer;
