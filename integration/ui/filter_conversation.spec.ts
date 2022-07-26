import {
  cySearchButton,
  cySearchField,
  cyConversationList,
} from 'handles';

describe('Filter conversation', () => {
  it('Filter conversation', () => {
    cy.visit('/control-center/connectors');
    cy.wait(500);

    cy.createChatPluginConversation();

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
