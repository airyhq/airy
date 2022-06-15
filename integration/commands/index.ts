import {connectChatPluginConnector, createChatPluginConversation} from './createChatPluginConversation';
import {editContactDetails} from './editContactDetails';
import {editDisplayName} from './editDisplayName';
import {listConversationsForContact} from './listConversationsForContact';

declare global {
  namespace cy {
    interface Chainable {
      createChatPluginConversation: () => void;
      editContactDetails: () => void;
      connectChatPluginConnector: () => void;
      editDisplayName: () => void;
      listConversationsForContact: () => void;
    }
  }
}

cy.Commands.add('createChatPluginConversation', createChatPluginConversation);
cy.Commands.add('editContactDetails', editContactDetails);
cy.Commands.add('connectChatPluginConnector', connectChatPluginConnector);
cy.Commands.add('editDisplayName', editDisplayName);
cy.Commands.add('listConversationsForContact', listConversationsForContact);
