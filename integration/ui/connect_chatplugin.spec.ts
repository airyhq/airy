import {
  cyChannelsChatPluginAddButton,
  cyConnectorsAddNewButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsFormBackButton,
  cyChannelsChatPluginList,
} from 'handles';

describe('Connect chatplugin channel', () => {
  it('Connect chatplugin channel', () => {
    cy.visit('/control-center/connectors');
    cy.wait(500);
    cy.url().should('include', '/control-center/connectors');
    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyConnectorsAddNewButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();
    cy.url().should('include', '/control-center/connectors/connected');
    cy.get(`[data-cy=${cyChannelsFormBackButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginList}]`).filter(`:contains("${Cypress.env('chatPluginName')}")`);
  });
});
