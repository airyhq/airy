import {connectChatPluginConnector, createChatPluginConversation} from './createChatPluginConversation';
import {editContactDetails} from './editContactDetails';


Cypress.Commands.add('createChatPluginConversation', createChatPluginConversation);
Cypress.Commands.add('editContactDetails', editContactDetails);
Cypress.Commands.add('connectChatPluginConnector', connectChatPluginConnector);