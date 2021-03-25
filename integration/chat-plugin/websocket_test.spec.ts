import {cyBubble, cyInputbarTextarea, cyInputbarButton} from 'chat-plugin-handles';

import {
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginConnectButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsChatPluginList,
  cyChannelsFormBackButton,
} from 'handles';

describe('Create UI Conversation', () => {
  it('Creates a chat plugin conversation', () => {
    // cy.visit('/login');
    // cy.get('form')
    //   .within(() => {
    //     cy.get('input[type=email]').type(Cypress.env('username'));
    //     cy.get('input[type=password]').type(Cypress.env('password'));
    //   })
    //   .submit();

    // cy.wait(500);

    // cy.visit('/channels');
    // cy.wait(500);
    // cy.url().should('include', '/channels');
    // cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    // cy.get(`[data-cy=${cyChannelsChatPluginConnectButton}]`).click();
    // cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
    // cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();

    cy.visit('http://airy.core/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();
    cy.wait(3500);
    cy.request('POST', 'http://airy.core/users.login', {
      email: 'kazeem@airy.co',
      password: 'test1234',
    }).then(response => {
      const newToken = response.body['token'];
      console.log('LoginToken', newToken);

      cy.request({
        method: 'POST',
        url: 'http://airy.core/conversations.list',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
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
            Authorization: `Bearer ${newToken}`,
          },
          body: {
            conversation_id: `${conversationId}`,
            message: {
              text: 'Today is Wednesday',
            },
          },
        }).then(response => {
          expect(response.body.content.text).to.contain('Today is Wednesday');

          // cy.request('POST', 'http://airy.core/messages.send', {
          //   headers: {
          //     'Content-Type': 'application/json',
          //     Authorization: `Bearer ${newToken}`,
          //   },
          //   conversation_id: `Bearer ${conversationId}`,
          //   message: {
          //     text: 'Hello World',
          //   },
          // }).then(response => {
          //   expect(response).property('status').to.equal(200); // message sucessfully sent
          //   expect(response).property('body').to.contain({
          //     content: '{"text":"Hello World"}',
          //   });
        });
      });
    });

    // cy.request('POST', 'http://airy.core/conversation.list'

    // // send message on behalf of authenticated user
  });
});
