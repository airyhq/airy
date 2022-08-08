import {cyChannelsFormBackButton, cyChannelsChatPluginList} from 'handles';

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      createChatPluginConversation(): Chainable<Subject>;
      editContactDetails(): Chainable<Subject>;
      connectChatPluginConnector(): Chainable<Subject>;
      editDisplayName(): Chainable<Subject>;
      listConversationsForContact(): Chainable<Subject>;
    }
  }
}

describe('Connect chatplugin channel', () => {
  it('Connect chatplugin channel', () => {
    cy.visit('/control-center/connectors');
    cy.wait(8000);
    cy.url().should('include', '/control-center/connectors');
    cy.connectChatPluginConnector();

    cy.url().should('include', '/control-center/connectors');
    cy.get(`[data-cy=${cyChannelsFormBackButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginList}]`).filter(`:contains("${Cypress.env('chatPluginName')}")`);
  });
});
