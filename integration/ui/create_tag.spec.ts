import {
  cyShowTagsDialog,
  cyTagsDialogInput,
  cyTagsDialogButton,
  cyTagsDialogColorSelectorRed,
  cyTagsSearchField,
  cyTagsTable,
} from 'handles';

const tagName = 'prio';

it('Creates a tag', () => {
  cy.visit('/login');
  cy.get('form')
    .within(() => {
      cy.get('input[type=email]').type(Cypress.env('username'));
      cy.get('input[type=password]').type(Cypress.env('password'));
    })
    .submit();

  cy.get(`[data-cy=${cyShowTagsDialog}]`).click();
  cy.get(`[data-cy=${cyTagsDialogInput}]`).type(tagName);
  cy.get(`[data-cy=${cyTagsDialogColorSelectorRed}]`).check({force: true});
  cy.get(`[data-cy=${cyTagsDialogButton}]`).click();

  cy.visit('/tags');
  cy.get(`[data-cy=${cyTagsSearchField}]`).type(tagName);
  cy.get(`[data-cy=${cyTagsTable}]`).children().children().its('length').should('be.gte', 2);
});
