import {cyBubble, cyInputbarTextarea, cyInputbarButton} from 'chat-plugin-handles';

describe(
  'Chatplugin',
  {
    baseUrl: 'http://airy.core/chatplugin/ui',
  },
  () => {
    const channelId = 'bbeff18c-6517-5506-b464-8353b8923d46';
    const messageChatplugin = 'Hello from Chatplugin!';

    it('Creates a chat plugin conversation', () => {
      cy.visit('/example?channel_id=' + channelId);
      cy.get(`[data-cy=${cyBubble}]`).click();
      cy.get(`[data-cy=${cyInputbarTextarea}]`).type(messageChatplugin);
      cy.get(`[data-cy=${cyInputbarButton}]`).click();
    });
  }
);
