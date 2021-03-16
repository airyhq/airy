import {cySearchButton, cySearchField, cyConversationList} from 'handles';

describe('Login', () => {
  it('Filters conversation', () => {
    const searchQuery = 'Inbox';

    cy.visit('/login');
    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type(Cypress.env('username'));
        cy.get('input[type=password]').type(Cypress.env('password'));
      })
      .submit();

    cy.url().should('include', '/conversations');

    cy.get(`[data-cy=${cyConversationList}]`).children().children().children().its('length').should('gte', 1);

    cy.get(`[data-cy=${cySearchButton}]`).click();
    cy.get(`[data-cy=${cySearchField}]`).get('input').type(searchQuery);

    cy.get(`[data-cy=${cyConversationList}]`).children().children().its('length').should('eq', 1);
  });
});
