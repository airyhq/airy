import {cyBubble, cyInputbarTextarea, cyInputbarButton, cyChatPluginMessageList} from 'chat-plugin-handles';

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

    cy.visit('http://airy.core/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.wait(500);

    cy.get(`[data-cy=${cyChatPluginMessageList}]`).children().its('length').should('eq', 2);

    cy.wait(2500);

    cy.request('POST', 'http://airy.core/users.login', {
      email: Cypress.env('username'),
      password: Cypress.env('password'),
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
        cy.wait(3000);

        cy.get(`[data-cy=${cyChatPluginMessageList}]`).children().its('length').should('eq', 3);
      });
    });
  });
});
