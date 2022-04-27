import {cyEditDisplayNameIcon, cyDisplayName, cyDisplayNameInput, cyEditDisplayNameCheckmark} from 'handles';

describe('Edits the display name of a conversation', () => {
  it('Edits the display name of a conversation', () => {
    cy.visit('/inbox/');
    cy.url().should('include', '/inbox');

    cy.get(`[data-cy=${cyEditDisplayNameIcon}]`).click({force: true});

    cy.get(`[data-cy=${cyDisplayNameInput}]`).type('new name');
    cy.get(`[data-cy=${cyEditDisplayNameCheckmark}]`).click();

    cy.get(`[data-cy=${cyDisplayName}]`).contains('new name');
  });
});
