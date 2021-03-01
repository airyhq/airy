describe('Login', () => {
  it('Logs into the UI', () => {
    cy.visit('/login');

    cy.get('form')
      .within(() => {
        cy.get('input[type=email]').type(Cypress.env('username'));
        cy.get('input[type=password]').type(Cypress.env('password'));
      })
      .submit();

    cy.url().should('include', '/inbox');
  });
});
