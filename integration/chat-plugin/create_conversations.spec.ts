import {cyInputbarButton, cyInputbarTextarea} from 'chat-plugin-handles';

for (let i = 0; i < 300; i++) {
  describe('Connect chatplugin channel', () => {
    it('Connect chatplugin channel', () => {
      cy.request({
        method: 'POST',
        url: '/channels.chatplugin.connect',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name: 'chat plugin',
        },
      }).then(response => {
        expect(response).property('status').to.equal(200);
        let channelId = response.body.id;

        cy.log('response', response);
        cy.log('channelId', channelId);

        cy.visit('/chatplugin/ui/example?channel_id=' + channelId);
        cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
        cy.get(`[data-cy=${cyInputbarButton}]`).click();
      });
    });
  });
}
