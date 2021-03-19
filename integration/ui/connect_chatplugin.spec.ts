import {
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginConnectButton,
  cyChannelsChatPluginFormNameInput,
  cyChannelsChatPluginFormSubmitButton,
  cyChannelsChatPluginFormBackButton,
  cyChannelsChatPluginList,
} from 'handles';

describe('Connect chatplugin channel', () => {
  it('Logs into the UI', () => {
    const chatPluginName = 'Cypress Chatplugin';

    cy.visit('/login');

    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type(Cypress.env('username'));
        cy.get('input[type=password]').type(Cypress.env('password'));
      })
      .submit();

    cy.visit('/channels');
    cy.wait(500);
    cy.url().should('include', '/channels');
    cy.get(`[data-cy=${cyChannelsChatPluginAddButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginConnectButton}]`).click();
    cy.get(`[data-cy=${cyChannelsChatPluginFormNameInput}]`).type(chatPluginName);
    cy.get(`[data-cy=${cyChannelsChatPluginFormSubmitButton}]`).click();
    // cy.get(`[data-cy=${cyChannelsChatPluginFormBackButton}]`).click();
    // cy.get(`[data-cy=${cyChannelsChatPluginList}]`)
    //   .children()
    //   .filter(`:contains(${chatPluginName})`)
    //   .should('have.length', 1);
  });
});
