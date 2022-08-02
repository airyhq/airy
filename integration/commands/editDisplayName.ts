import {cyEditDisplayNameIcon, cyDisplayName, cyDisplayNameInput, cyEditDisplayNameCheckmark} from 'handles';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      editDisplayName(): Chainable<Subject>;
    }
  }
}

export const editDisplayName = (): void => {
  cy.get(`[data-cy=${cyEditDisplayNameIcon}]`).click({force: true});
  cy.wait(500);

  cy.get(`[data-cy=${cyDisplayNameInput}]`).type('new name');
  cy.get(`[data-cy=${cyEditDisplayNameCheckmark}]`).click();

  cy.get(`[data-cy=${cyDisplayName}]`).contains('new name');
};
