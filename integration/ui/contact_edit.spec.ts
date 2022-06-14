import {
  cyConversationList, 
  cyEditContactIcon,
} from 'handles';
import '../support';

//refactor this to reuse 

describe('Display and edit the contact details of a conversation', () => {
  before(() => {
    cy.visit('/inbox/inbox/');
    cy.url().should('include', '/inbox');
    cy.get(`[data-cy=${cyConversationList}]`).first().click();
  });

  beforeEach(() => {
    cy.get(`[data-cy=${cyEditContactIcon}]`).click();
  });

  it('edit contact details, save them, and cancel the edit', () => {
    cy.editContactDetails()
  })

});
