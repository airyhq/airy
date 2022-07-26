import {cyInputbarTextarea, cyInputbarButton, cyChatPluginMessageList} from 'chat-plugin-handles';

import {
  cyChannelsChatPluginAddButton,
  cyConnectorsAddNewButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
} from 'handles';

describe('Websocket test', () => {
  it('Send message from Inbox to Chatplugin and assert Websocket is working', () => {
    cy.visit('/control-center/connectors');
    cy.wait(500);
    cy.url().should('include', '/connectors');
    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyConnectorsAddNewButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();

    cy.visit('/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.wait(500);

    cy.get(`[data-cy=${cyChatPluginMessageList}]`).children().its('length').should('eq', 2);

    cy.wait(2500);

    cy.request({
      method: 'POST',
      url: Cypress.env('baseRequestUrl') + '/conversations.list',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        cursor: null,
        page_size: 2,
      },
    }).then(response => {
      const conversationId = response.body.data[0].id;

      cy.request({
        method: 'POST',
        url: Cypress.env('baseRequestUrl') + '/messages.send',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          conversation_id: `${conversationId}`,
          message: {
            text: Cypress.env('websocketMessage'),
          },
        },
      }).then(response => {
        expect(response).property('status').to.equal(200);
      });
      cy.wait(3000);

      cy.get(`[data-cy=${cyChatPluginMessageList}]`).children().its('length').should('eq', 3);
    });
  });
});
