import {cyContactItem, cyContactEmail} from 'handles';

describe('Contacts page lists contacts and allow to edit contacts details and display name', () => {
  beforeEach(() => {
    cy.visit('/inbox/contacts');
    cy.url().should('include', '/contacts');
    cy.wait(500);
  });

  it('Displays item contact details on click and allows to edit them', () => {
    cy.get(`[data-cy=${cyContactItem}]`).first().click();
    cy.wait(500);
    cy.editContactDetails();
    cy.editDisplayName();
  });

  it('The available conversations are listed when the contact has conversations', () => {
    cy.get(`[data-cy=${cyContactItem}]`).first().click();
    cy.wait(500);
    cy.listConversationsForContact();
  });

  it('Collapse and expands contact column on icon click', () => {
    cy.get(`[data-cy=${cyContactItem}]`).first().click();
    cy.wait(500);

    cy.get(`[data-cy=${cyContactEmail}]`).should('be.visible');

    cy.get(`[data-cy=${cyContactEmail}]`).should('not.exist');
  });
});
