import {
  cyBubble,
  cyInputbarTextarea,
  cyInputbarButton,
  cyChatPluginMessageList,
  cyChatPluginHeaderBarCloseButton,
  cyChatPluginEndChatModalButton,
  cyChatPluginStartNewConversation,
} from 'chat-plugin-handles';

describe('Websocket test', () => {
  it('Send message from Inbox to Chatplugin, ends the current conversation and starts a new conversation', () => {
    cy.visit('/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();
    cy.get(`[data-cy=${cyChatPluginMessageList}]`).children().its('length').should('eq', 2);

    cy.wait(500);

    cy.get(`[data-cy=${cyChatPluginHeaderBarCloseButton}]`).click();
    cy.get(`[data-cy=${cyChatPluginEndChatModalButton}]`).click();
    cy.get(`[data-cy=${cyChatPluginStartNewConversation}]`).click();
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('newNessageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();
    cy.wait(500);

    cy.get(`[data-cy=${cyChatPluginMessageList}]`).children().its('length').should('eq', 2);
  });
});
