import {cyBubble, cyInputbarTextarea, cyInputbarButton} from 'chat-plugin-handles';

describe(
  'Chatplugin',
  {
    baseUrl: 'http://airy.core/chatplugin',
  },
  () => {
    const channelId = 'db2e1b00-143b-578e-be91-6d45a3038fae';
    const messageChatplugin = 'Hello from Chatplugin!';

    it('Creates a chat plugin conversation', () => {
      cy.visit('/example?channel_id=' + channelId);
      cy.get(`[data-cy=${cyBubble}]`).click();
      cy.get(`[data-cy=${cyInputbarTextarea}]`).type(messageChatplugin);
      cy.get(`[data-cy=${cyInputbarButton}]`).click();
    });
  }
);
