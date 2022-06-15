import {connectChatPluginConnector, createChatPluginConversation} from './createChatPluginConversation';
import {editContactDetails} from './editContactDetails';
import {editDisplayName} from './editDisplayName';
import {listConversationsForContact} from './listConversationsForContact';

declare global {
  namespace Cypress {
    interface Chainable {
      createChatPluginConversation: typeof createChatPluginConversation;
      editContactDetails: typeof editContactDetails;
      connectChatPluginConnector: typeof connectChatPluginConnector;
      editDisplayName: typeof editDisplayName;
      listConversationsForContact: typeof listConversationsForContact;
    }
  }
}

Cypress.Commands.add('createChatPluginConversation', createChatPluginConversation);
Cypress.Commands.add('editContactDetails', editContactDetails);
Cypress.Commands.add('connectChatPluginConnector', connectChatPluginConnector);
Cypress.Commands.add('editDisplayName', editDisplayName);
Cypress.Commands.add('listConversationsForContact', listConversationsForContact);
