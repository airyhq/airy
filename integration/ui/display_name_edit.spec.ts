describe('Edits the display name of a conversation', () => {
  it('Edits the display name of a conversation', () => {
    cy.visit('/inbox/inbox');
    cy.url().should('include', '/inbox');

    cy.editDisplayName();
  });
});
