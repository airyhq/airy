import {
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginConnectButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
} from 'handles';

describe('Connect chatplugin channel', () => {
  it('Logs into the UI', () => {
    const chatPluginName = 'Chatplugin';

    cy.visit('/login');

    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type(Cypress.env('username'));
        cy.get('input[type=password]').type(Cypress.env('password'));
      })
      .submit();

    cy.url().should('include', '/inbox');
    cy.visit('/channels');
    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginConnectButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(chatPluginName);
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();
  });
});
