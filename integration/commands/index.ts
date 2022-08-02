import {connectChatPluginConnector, createChatPluginConversation} from './createChatPluginConversation';
import {editContactDetails} from './editContactDetails';
import {editDisplayName} from './editDisplayName';
import {listConversationsForContact} from './listConversationsForContact';

declare global {
  namespace Cypress {
    interface Chainable {
      createChatPluginConversation(): Chainable<Element>;
      editContactDetails(): Chainable<Element>;
      connectChatPluginConnector(): Chainable<Element>;
      editDisplayName(): Chainable<Element>;
      listConversationsForContact(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add('createChatPluginConversation', createChatPluginConversation);
Cypress.Commands.add('editContactDetails', editContactDetails);
Cypress.Commands.add('connectChatPluginConnector', connectChatPluginConnector);
Cypress.Commands.add('editDisplayName', editDisplayName);
Cypress.Commands.add('listConversationsForContact', listConversationsForContact);
