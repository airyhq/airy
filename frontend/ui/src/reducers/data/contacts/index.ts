import {ActionType, getType} from 'typesafe-actions';
import {ContactInfo} from 'model';
import {AllConversationsState} from '../conversations';
import * as actions from '../../../actions/contacts';


type Action = ActionType<typeof actions>;

const initialState = {
    all: {},
  };

export type Contacts = {
    all: {
        [conversationId: string]: ContactInfo
    };
  };

const contactsReducer = (state= initialState, action: Action) => {
    switch(action.type){
        case(getType(actions.getContactsInfoAction)):
        console.log('GET action.payload', action.payload);
            return {
            ...state, 
            all: {
                ...state.all,
                [action.payload.conversationId]: action.payload.contactsInfo
            }
           
        }
        case(getType(actions.updateContactsInfoAction)):
        console.log(' UPDATE action.payload', action.payload);
            return {
                ...state,
                all: {
                    ...state.all,
                    [action.payload.conversationId]: {...state.all[action.payload.conversationId], ...action.payload.updatedContactsInfo}
                } 
            }

        default:
            return state;
    }
}

export default contactsReducer;