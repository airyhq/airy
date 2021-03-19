import {cyBubble, cyInputbarButton, cyInputbarTextarea} from 'chat-plugin-handles';
import {
  cySearchButton,
  cySearchField,
  cyConversationList,
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginConnectButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsChatPluginList,
} from 'handles';

describe('Filters conversation', () => {
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
      cy.wait(500);
      cy.url().should('include', '/channels/connected');
      cy.get(`[data-cy=${cyChannelsChatPluginList}]`).filter(':contains("Cypress Chatplugin")')

    // cy.visit('http://airy.core/chatplugin/ui/example?channel_id=' + (Cypress.env('channelId')));
    // cy.get(`[data-cy=${cyBubble}]`).click();
    // cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    // cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.visit('/');
    cy.url().should('include', '/conversations');

    cy.get(`[data-cy=${cyConversationList}]`).children().children().children().its('length').should('gte', 1);

    cy.get(`[data-cy=${cySearchButton}]`).click();
    cy.get(`[data-cy=${cySearchField}]`).get('input').type(Cypress.env('searchQuery'));

    cy.get(`[data-cy=${cyConversationList}]`).children().children().its('length').should('eq', 1);
  });
});
