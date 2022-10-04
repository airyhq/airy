import {
  cyAddChannelButton,
  cyConnectorsAddNewButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsChatPluginList,
  cyChannelCreatedChatPluginCloseButton,
} from 'handles';
import {cyInputbarButton, cyInputbarTextarea} from 'chat-plugin-handles';

export const connectChatPluginConnector = (): void => {
  cy.get(`[data-cy=${cyAddChannelButton}]`).click();
  cy.wait(500);
  cy.get(`[data-cy=${cyConnectorsAddNewButton}]`).click({force: true});
  cy.wait(500);
  cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'), {force: true});
  cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();
  cy.get(`[data-cy=${cyChannelCreatedChatPluginCloseButton}]`).click();
};

export const createChatPluginConversation = (): void => {
  cy.visit('/control-center/connectors');
  cy.wait(500);
  cy.connectChatPluginConnector();

  cy.wait(500);
  cy.get(`[data-cy=${cyChannelsChatPluginList}]`).filter(`:contains("${Cypress.env('chatPluginName')}")`);

  cy.visit('/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
  cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
  cy.get(`[data-cy=${cyInputbarButton}]`).click();
};
