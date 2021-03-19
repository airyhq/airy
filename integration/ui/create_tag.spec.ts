import {
  cyShowTagsDialog,
  cyTagsDialogInput,
  cyTagsDialogButton,
  cyTagsDialogColorSelectorRed,
  cyTagsSearchField,
  cyTagsTable,
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginConnectButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsChatPluginFormBackButton,
  cyTagsTableRowDisplayDeleteModal,
  cyTagsTableRowDisplayDeleteModalInput,
  cyTagsTableRowDisplayDeleteModalButton,
} from 'handles';

describe('Creates and Deletes Tag', () => {
  it('Login', () => {
    cy.visit('/login');
    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type(Cypress.env('username'));
        cy.get('input[type=password]').type(Cypress.env('password'));
      })
      .submit();

    cy.wait(500);

    cy.visit('/channels');
    cy.wait(500);
    cy.url().should('include', '/channels');
    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginConnectButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();
    // cy.get(`[data-cy=${cyChannelsChatPluginFormBackButton}]`).click();

    // cy.visit('http://airy.core/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    // cy.get(`[data-cy=${cyBubble}]`).click();
    // cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    // cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.visit('/');
    cy.get(`[data-cy=${cyShowTagsDialog}]`).click();
    cy.get(`[data-cy=${cyTagsDialogInput}]`).type(Cypress.env('tagName'));
    cy.get(`[data-cy=${cyTagsDialogColorSelectorRed}]`).check({force: true});
    cy.get(`[data-cy=${cyTagsDialogButton}]`).click();

    cy.visit('/tags');
    cy.wait(500);
    cy.get(`[data-cy=${cyTagsSearchField}]`).type(Cypress.env('tagName'));
    cy.get(`[data-cy=${cyTagsTable}]`).children().children().its('length').should('be.gte', 2);
    cy.get(`[data-cy=${cyTagsTable}]`).children().children();
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModal}]`).click();
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModalInput}]`).type('DELETE');
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModalButton}]`).click();
  });
});
