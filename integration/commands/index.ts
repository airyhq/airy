import {connectChatPluginConnector, createChatPluginConversation} from './createChatPluginConversation';
import {editContactDetails} from './editContactDetails';
import {editDisplayName} from './editDisplayName';
import {listConversationsForContact} from './listConversationsForContact';

declare global {
  namespace Cypress {
    interface Chainable {
      createChatPluginConversation(): Chainable<void>;
      editContactDetails(): Chainable<void>;
      connectChatPluginConnector(): Chainable<void>;
      editDisplayName(): Chainable<void>;
      listConversationsForContact(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('createChatPluginConversation', createChatPluginConversation);
Cypress.Commands.add('editContactDetails', editContactDetails);
Cypress.Commands.add('connectChatPluginConnector', connectChatPluginConnector);
Cypress.Commands.add('editDisplayName', editDisplayName);
Cypress.Commands.add('listConversationsForContact', listConversationsForContact);
