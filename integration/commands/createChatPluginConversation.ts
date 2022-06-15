import {
  cyChannelsChatPluginAddButton,
  cyConnectorsAddNewButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsChatPluginList,
  cyChannelsFormBackButton,
} from 'handles';
import {cyInputbarButton, cyInputbarTextarea} from 'chat-plugin-handles';

export const connectChatPluginConnector = () => {
  cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
  cy.get(`[data-cy=${cyConnectorsAddNewButton}]`).click();
  cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
  cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();
};

export const createChatPluginConversation = () => {
  cy.visit('/control-center/connectors');
  cy.wait(500);
  cy.connectChatPluginConnector();

  cy.get(`[data-cy=${cyChannelsFormBackButton}]`).click();
  cy.wait(500);
  cy.get(`[data-cy=${cyChannelsChatPluginList}]`).filter(`:contains("${Cypress.env('chatPluginName')}")`);

  cy.visit('/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
  cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
  cy.get(`[data-cy=${cyInputbarButton}]`).click();
};
