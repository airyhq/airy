import {cyMessageTextArea, cyMessageSendButton, cyMessageList} from 'handles';

describe('Send chatplugin Message', () => {
  const messageInbox = 'Hello from Inbox!';

  it('Logs into the UI', () => {
    cy.visit('/login');

    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type(Cypress.env('username'));
        cy.get('input[type=password]').type(Cypress.env('password'));
      })
      .submit();

    cy.url().should('include', '/inbox');
  });

  it('Opens conversation and sends reply in Inbox', () => {
    cy.get(`[data-cy=${cyMessageTextArea}]`).type(messageInbox);
    cy.get(`[data-cy=${cyMessageSendButton}]`).click();
    cy.get(`[data-cy=${cyMessageList}]`).children().its('length').should('be.gte', 1);
  });
});
