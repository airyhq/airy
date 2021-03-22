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
  cyTagsTableRowDisplayDeleteModal,
  cyTagsTableRowDisplayDeleteModalInput,
  cyTagsTableRowDisplayDeleteModalButton,
  cyChannelsChatPluginList,
  cyChannelsFormBackButton,
} from 'handles';

import {cyBubble, cyInputbarButton, cyInputbarTextarea} from 'chat-plugin-handles';

describe('Creates and Deletes Tag', () => {
  it('Login', () => {
    (cy as any).login(Cypress.env('username'), Cypress.env('password'));

    cy.visit('/channels');
    cy.wait(500);
    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginConnectButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();

    cy.get(`[data-cy=${cyChannelsFormBackButton}]`).click();

    cy.visit('http://airy.core/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.visit('/');
    cy.get(`[data-cy=${cyShowTagsDialog}]`).click();
    cy.get(`[data-cy=${cyTagsDialogInput}]`).type(Cypress.env('tagName'));
    cy.get(`[data-cy=${cyTagsDialogColorSelectorRed}]`).check({force: true});
    cy.get(`[data-cy=${cyTagsDialogButton}]`).click();

    cy.visit('/tags');
    cy.get(`[data-cy=${cyTagsSearchField}]`).type(Cypress.env('tagName'));
    cy.get(`[data-cy=${cyTagsTable}]`).children().children().its('length').should('be.gte', 2);
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModal}]`).click();
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModalInput}]`).type('DELETE');
    cy.get(`[data-cy=${cyTagsTableRowDisplayDeleteModalButton}]`).click();
  });
});
