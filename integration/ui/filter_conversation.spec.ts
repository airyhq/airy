import {
  cySearchButton,
  cySearchField,
  cyConversationList,
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginConnectButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsFormBackButton,
} from 'handles';

import {cyBubble, cyInputbarButton, cyInputbarTextarea} from 'chat-plugin-handles';

describe('Filters conversation', () => {
  it('Login', () => {
    cy.visit('/login');
    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type(Cypress.env('username'));
        cy.get('input[type=password]').type(Cypress.env('password'));
      })
      .submit();

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

    cy.get(`[data-cy=${cyConversationList}]`).children().children().its('length').should('gte', 1);
    cy.wait(500);

    cy.get(`[data-cy=${cyConversationList}]`)
      .first()
      .contains(/^Chatplugin \w*$/)
      .invoke('text')
      .then(text => {
        cy.get(`[data-cy=${cySearchButton}]`).click();
        cy.get(`[data-cy=${cySearchField}]`).get('input').type(text.replace('Chatplugin ', ''));
        cy.get(`[data-cy=${cyConversationList}]`).children().children().children().its('length').should('eq', 1);
      });
  });
});
