import {cySuggestionsButton, cySuggestionsList, cyMessageSendButton, cyMessageList} from 'handles';

describe('adds two suggested replies to a message and sends one of the suggested replies to a chatplugin conversation', () => {
  it('adds two suggested replies to a message and sends one suggested reply', () => {
    cy.request({
      method: 'POST',
      url: '/messages.suggestReplies',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        message_id: Cypress.env('messageId'),
        suggestions: {
          'suggestion-id-1': {
            content: {text: 'Welcome!'},
          },
          'suggestion-id-2': {
            content: {text: 'Have a nice day!'},
          },
        },
      },
    }).then(response => {
      expect(response).property('status').to.equal(200);
      cy.visit(`/inbox/inbox/conversations/${Cypress.env('conversationId')}`);
      cy.url().should('include', '/inbox');

      cy.get(`[data-cy=${cySuggestionsButton}]`);

      cy.get(`[data-cy=${cySuggestionsButton}]`).click();

      cy.get(`[data-cy=${cySuggestionsList}]`).contains('Welcome!').click({force: true});

      cy.get(`[data-cy=${cyMessageSendButton}]`).click();

      cy.get(`[data-cy=${cyMessageList}]`).contains('Welcome!');
    });
  });
});
