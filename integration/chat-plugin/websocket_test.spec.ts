import {cyBubble, cyInputbarTextarea, cyInputbarButton} from 'chat-plugin-handles';

describe('Create UI Conversation', () => {
  it('Creates a chat plugin conversation', () => {
    cy.visit('http://airy.core/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyBubble}]`).click();
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.visit('/login');
    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type(Cypress.env('username'));
        cy.get('input[type=password]').type(Cypress.env('password'));
      })
      .submit();

    cy.wait(500);

    // send message on behalf of authenticated user
    cy.request('POST', 'http://airy.core/messages.send', {
      conversation_id: 'a688d36c-a85e-44af-bc02-4248c2c97622',
      message: {
        text: 'Hello World',
      },
    }).then(response => {
      expect(response).property('status').to.equal(200); // message sucessfully sent
      expect(response).property('body').to.contain({
        content: '{"text":"Hello World"}',
      });
    });
  });
});
