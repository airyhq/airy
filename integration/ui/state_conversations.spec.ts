import {cyOpenStateButton, cyClosedStateButton, cyConversationListItemInfo, cyConversationStatus} from 'handles';

function closeConversation() {
  cy.get(`[data-cy=${cyOpenStateButton}]`).first().click();
  cy.get(`[data-cy=${cyClosedStateButton}]`);
  cy.get(`[data-cy=${cyConversationStatus}]`).invoke('attr', 'class').should('contain', 'closed');
}

function openConversation() {
  cy.get(`[data-cy=${cyClosedStateButton}]`).first().click();
  cy.get(`[data-cy=${cyOpenStateButton}]`);
  cy.get(`[data-cy=${cyConversationStatus}]`).invoke('attr', 'class').should('contain', 'open');
}

describe('toggles the state of a conversation, accurately changing the Open and Closed state buttons in the ConversationList and Messenger', () => {
  it('toggles the state of a conversation', () => {
    cy.visit('/ui/');
    cy.url().should('include', '/inbox');

    cy.get(`[data-cy=${cyConversationListItemInfo}]`).then(conversationListItemInfo => {
      if (conversationListItemInfo.find(`[data-cy=${cyOpenStateButton}]`).length > 0) {
        closeConversation();
        openConversation();
      } else {
        openConversation();
        closeConversation();
      }
    });
  });
});
