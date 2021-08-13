describe('Login', () => {
  it('logs in', () => {
    // note: async/await breaks cypress 😭
    cy.task('factory', { name: 'User' }).then((user) => {
      cy.visit('/');
      cy.findByText(/login/i).click();

      cy.location('pathname').should('equal', '/api/auth/signin');
      cy.findByLabelText(/email/i).type(user.email);
      cy.findAllByRole('button', { name: /sign in with email/i }).click();

      cy.findByText(/check your email/i).should('exist');
      cy.location('pathname').should('equal', '/api/auth/verify-request');
    });
  });
});
