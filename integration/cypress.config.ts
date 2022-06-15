import {defineConfig} from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://airy.core',
    specPattern: 'integration/**/*.spec.?s',
    supportFile: 'integration/commands/index.ts',
  },
  env: {
    chatPluginName: 'Cypress Chatplugin',
    tagName: 'Cypress Tag',
    searchQuery: 'Cypress Filter',
    messageInbox: 'Hello from Cypress Inbox!',
    messageChatplugin: 'Hello from Cypress ChatPlugin!',
    newMessageChatplugin: 'Hello once again from Cypress ChatPlugin!',
    websocketMessage: 'Websocket Test Message',
    channelId: '1cd1b148-0cea-47af-801c-ae65baf3012e',
    messageId: '683e32bf-42f7-48c0-a701-d8e66f252c7b',
    conversationId: '05e86332-e6cd-4de5-9e1f-6c7c84994e03',
  },
  viewportHeight: 800,
  viewportWidth: 1280,
  video: false,
});
