import {
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsFormBackButton,
  cyChannelsChatPluginList,
} from 'handles';

describe('Connect chatplugin channel', () => {
  it('Connect chatplugin channel', () => {
    cy.visit('/inbox/channels');
    cy.wait(500);
    cy.url().should('include', '/inbox/channels');
    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(Cypress.env('chatPluginName'));
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();
    cy.url().should('include', '/inbox/channels/connected');
    cy.get(`[data-cy=${cyChannelsFormBackButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginList}]`).filter(`:contains("${Cypress.env('chatPluginName')}")`);
  });
});
