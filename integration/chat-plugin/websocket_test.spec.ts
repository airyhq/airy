import {cyChatPluginMessageList} from 'chat-plugin-handles';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      createChatPluginConversation(): Chainable<Subject>;
      editContactDetails(): Chainable<Subject>;
      connectChatPluginConnector(): Chainable<Subject>;
      editDisplayName(): Chainable<Subject>;
      listConversationsForContact(): Chainable<Subject>;
    }
  }
}

describe('Websocket test', () => {
  it('Send message from Inbox to Chatplugin and assert Websocket is working', () => {
    cy.createChatPluginConversation();

    cy.wait(500);

    cy.get(`[data-cy=${cyChatPluginMessageList}]`).children().its('length').should('eq', 2);

    cy.wait(2500);

    cy.request({
      method: 'POST',
      url: '/conversations.list',
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
        url: '/messages.send',
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
