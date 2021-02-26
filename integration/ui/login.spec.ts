describe('Login', () => {
  it('Logs into the UI', () => {
    cy.visit('/login');

    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type('grace@example.com');
        cy.get('input[type=password]').type('the_answer_is_42');
      })
      .submit();

    cy.url().should('include', '/inbox');
  });
});
