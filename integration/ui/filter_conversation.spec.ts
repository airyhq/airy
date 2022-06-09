import {
  cySearchButton,
  cySearchField,
  cyConversationList,
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsFormBackButton,
  cyConnectorsAddNewButton,
} from 'handles';

import {cyInputbarButton, cyInputbarTextarea} from 'chat-plugin-handles';

describe('Filter conversation', () => {
  it('Filter conversation', () => {
    cy.visit('/control-center/connectors');
    cy.wait(500);

    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyConnectorsAddNewButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();

    cy.get(`[data-cy=${cyChannelsFormBackButton}]`).click();

    cy.visit('/chatplugin/ui/example?channel_id=' + Cypress.env('channelId'));
    cy.get(`[data-cy=${cyInputbarTextarea}]`).type(Cypress.env('messageChatplugin'));
    cy.get(`[data-cy=${cyInputbarButton}]`).click();

    cy.visit('/inbox/inbox');

    cy.get(`[data-cy=${cyConversationList}]`).children().children().its('length').should('gte', 1);
    cy.wait(500);

    cy.get(`[data-cy=${cyConversationList}]`)
      .first()
      .contains(/^Chatplugin \w*$/)
      .invoke('text')
      .then(text => {
        cy.get(`[data-cy=${cySearchButton}]`).click();
        cy.get(`[data-cy=${cySearchField}]`).get('input').type(text.replace('Chatplugin ', ''));
        cy.get(`[data-cy=${cyConversationList}]`).children().children().children().its('length').should('eq', 1);
      });
  });
});
