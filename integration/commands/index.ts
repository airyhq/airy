/// <reference types="cypress" />
import {connectChatPluginConnector, createChatPluginConversation} from './createChatPluginConversation';
import {editContactDetails} from './editContactDetails';
import {editDisplayName} from './editDisplayName';
import {listConversationsForContact} from './listConversationsForContact';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      createChatPluginConversation(): Chainable<Subject>;
      editContactDetails(): Chainable<Subject>;
      connectChatPluginConnector(): Chainable<Subject>;
      editDisplayName(): Chainable<Subject>;
      listConversationsForContact(): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add('createChatPluginConversation', createChatPluginConversation);
Cypress.Commands.add('editContactDetails', editContactDetails);
Cypress.Commands.add('connectChatPluginConnector', connectChatPluginConnector);
Cypress.Commands.add('editDisplayName', editDisplayName);
Cypress.Commands.add('listConversationsForContact', listConversationsForContact);
