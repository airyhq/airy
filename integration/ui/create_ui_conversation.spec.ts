import {cyBubble, cyInputbarTextarea, cyInputbarButton} from 'handles';

describe(
  'Create UI Conversation',
  {
    baseUrl: 'http://airy.core/chatplugin/ui',
  },
  () => {
    const channelId = '3502a0a7-933d-5410-b5fc-51f041146d89';
    const messageChatplugin = 'Hello from Inbox!';

    it('Creates a chat plugin conversation', () => {
      cy.visit('/example?channel_id=' + channelId);
      cy.get(`[data-cy=${cyBubble}]`).click();
      cy.get(`[data-cy=${cyInputbarTextarea}]`).type(messageChatplugin);
      cy.get(`[data-cy=${cyInputbarButton}]`).click();
    });
  }
);
