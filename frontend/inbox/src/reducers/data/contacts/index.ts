import {ActionType, getType} from 'typesafe-actions';
import {Contact, Pagination} from 'model';
import * as actions from '../../../actions/contacts';
import {keyBy, omit} from 'lodash-es';

type Action = ActionType<typeof actions>;

const initialState = {
  all: {
    items: {},
    paginationData: {
      previousCursor: '',
      nextCursor: '',
      total: 0,
    },
  },
};

export type Contacts = {
  all: {
    items: {[id: string]: Contact};
    paginationData: Pagination;
  };
};

const contactsReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case getType(actions.listContactsAction):
      return {
        ...state,
        all: {
          items: {...state.all.items, ...keyBy(action.payload.contacts, 'id')},
          paginationData: action.payload.paginationData,
        },
      };
    case getType(actions.deleteContactAction):
      return {
        ...state,
        all: {
          ...state.all,
          items: omit(state.all.items, action.payload),
          paginationData: {
            ...state.all.paginationData,
            total: state.all.paginationData.total - 1,
          },
        },
      };
    case getType(actions.getContactDetailsAction):
      return {
        ...state,
        all: {
          ...state.all,
          items: {
            ...state.all.items,
            [action.payload.id]: action.payload.contact,
          },
        },
      };
    case getType(actions.updateContactDetailsAction):
      return {
        ...state,
        all: {
          ...state.all,
          items: {
            ...state.all.items,
            [action.payload.id]: {
              ...state.all.items[action.payload.id],
              ...action.payload.updatedContact,
            },
          },
        },
      };
    default:
      return state;
  }
};

export default contactsReducer;
