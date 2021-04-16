import {
  cyMessageTextArea,
  cyMessageSendButton,
  cyMessageList,
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginConnectButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsChatPluginList,
  cyChannelsFormBackButton,
} from 'handles';

import {cyBubble, cyInputbarButton, cyInputbarTextarea} from 'chat-plugin-handles';

describe('Send chat plugin message', () => {
  it('Send chat plugin message', () => {
    cy.visit('/ui/channels');
    cy.wait(500);
    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginConnectButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();

    cy.get(`[data-cy=${cyChannelsFormBackButton}]`).click();
    cy.wait(500);
    cy.get(`[data-cy=${cyChannelsChatPluginList}]`).filter(`:contains("${Cypress.env('chatPluginName')}")`);

    cy.visit('/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.visit('/ui/');
    cy.url().should('include', '/inbox');
    cy.get(`[data-cy=${cyMessageTextArea}]`).type(Cypress.env('messageInbox'));
    cy.get(`[data-cy=${cyMessageSendButton}]`).click();
    cy.get(`[data-cy=${cyMessageList}]`).children().its('length').should('be.gte', 1);
  });
});
