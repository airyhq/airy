import {cyConversationsListForContact, cyConversationForContactButton} from 'handles';

export const listConversationsForContact = (): void => {
  cy.get(`[data-cy=${cyConversationsListForContact}]`).should('be.visible');
  cy.get(`[data-cy=${cyConversationForContactButton}]`).first().click();
  cy.url().should('include', '/conversations');
};
