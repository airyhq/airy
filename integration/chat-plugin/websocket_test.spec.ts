import {cyBubble, cyInputbarTextarea, cyInputbarButton, cyChatPluginListChat} from 'chat-plugin-handles';

import {
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginConnectButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
} from 'handles';

describe('Create UI Conversation', () => {
  it('Creates a chat plugin conversation', () => {
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

    cy.visit('http://localhost:8080/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.wait(500);

    cy.get(`[data-cy=${cyChatPluginListChat}]`).children().its('length').should('eq', 2);

    cy.wait(3500);

    cy.request('POST', 'http://airy.core/users.login', {
      email: 'grace@example.com',
      password: 'the_answer_is_42',
    }).then(response => {
      const loginToken = response.body['token'];
      console.log('LoginToken', loginToken);

      cy.request({
        method: 'POST',
        url: 'http://airy.core/conversations.list',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginToken}`,
        },
        body: {
          cursor: null,
          page_size: 2,
        },
      }).then(response => {
        const conversationId = response.body.data[0].id;

        cy.request({
          method: 'POST',
          url: 'http://airy.core/messages.send',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginToken}`,
          },
          body: {
            conversation_id: `${conversationId}`,
            message: {
              text: 'Wonderful Day',
            },
          },
        }).then(response => {
          expect(response).property('status').to.equal(200);
        });
        cy.wait(3500);

        cy.get(`[data-cy=${cyChatPluginListChat}]`).children().its('length').should('eq', 3);
        cy.get(`[data-cy=${cyChatPluginListChat}]`).filter(':contains("Wonderful Day")');
      });
    });
  });
});
