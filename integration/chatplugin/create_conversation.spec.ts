describe(
  'Chatplugin',
  {
    baseUrl: 'http://chatplugin.airy',
  },
  () => {
    const channelId = 'db2e1b00-143b-578e-be91-6d45a3038fae';
    const messageChatplugin = 'Hello from Chatplugin!';
    const messageInbox = 'Hello from Inbox!';

    it('Creates a chat plugin conversation', () => {
      cy.visit('/example?channel_id=' + channelId);
      cy.get('[data-cy=bubble]').click();
      cy.get('[data-cy=inputbarTextarea]').type(messageChatplugin);
      cy.get('[data-cy=inputbarButton]').click();
    });
    it('Opens conversation in Inbox', {baseUrl: 'http://ui.airy'}, () => {
      cy.visit('/login');
      cy.get('form')
        .within(() => {
          cy.get('input[type=email]').type(Cypress.env('username'));
          cy.get('input[type=password]').type(Cypress.env('password'));
        })
        .submit();
      cy.get('[data-cy=messageTextArea]').type(messageInbox);
      cy.get('[data-cy=messageSendButton]').click();
      cy.get('[data-cy=messageList]').children().its('length').should('be.gte', 2);
    });
  }
);
