import {cyMessageTextArea, cyMessageSendButton, cyMessageList} from 'handles';

describe('Send chat plugin message', () => {
  it('Send chat plugin message', () => {
    cy.visit('/control-center/connectors');
    cy.wait(500);

    cy.createChatPluginConversation();

    cy.visit('/inbox/inbox');
    cy.url().should('include', '/inbox');
    cy.get(`[data-cy=${cyMessageTextArea}]`).type(Cypress.env('messageInbox'));
    cy.get(`[data-cy=${cyMessageSendButton}]`).click();
    cy.get(`[data-cy=${cyMessageList}]`).children().its('length').should('be.gte', 1);
  });
});
