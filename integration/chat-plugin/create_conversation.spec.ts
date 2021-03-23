import {cyBubble, cyInputbarTextarea, cyInputbarButton} from 'chat-plugin-handles';

describe('Create UI Conversation', () => {
  it('Creates a chat plugin conversation', () => {
    cy.visit('http://airy.core/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();
  });
});
