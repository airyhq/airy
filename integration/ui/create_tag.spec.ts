import {
  cyShowTagsDialog,
  cyTagsDialogInput,
  cyTagsDialogButton,
  cyTagsDialogColorSelectorRed,
  cyTagsSearchField,
  cyTagsTable,
  cyTagsTableRowDisplayDeleteModal,
  cyTagsTableRowDisplayDeleteModalInput,
  cyTagsTableRowDisplayDeleteModalButton,
} from 'handles';

describe('Creates and Deletes a Tag', () => {
  it('Creates and Deletes a Tag', () => {
    cy.createChatPluginConversation();

    cy.wait(500);

    cy.visit('/inbox/inbox');
    cy.get(`[data-cy=${cyShowTagsDialog}]`).click();
    cy.get(`[data-cy=${cyTagsDialogInput}]`).type(Cypress.env('tagName'));
    cy.get(`[data-cy=${cyTagsDialogColorSelectorRed}]`).check({force: true});
    cy.get(`[data-cy=${cyTagsDialogButton}]`).click();

    cy.visit('/inbox/tags');
    cy.get(`[data-cy=${cyTagsSearchField}]`).type(Cypress.env('tagName'));
    cy.get(`[data-cy=${cyTagsTable}]`).children().children().its('length').should('be.gte', 2);
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModal}]`).click();
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModalInput}]`).type('DELETE');
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModalButton}]`).click();
  });
});
