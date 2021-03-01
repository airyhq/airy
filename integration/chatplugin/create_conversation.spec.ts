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
      cy.get('[data-cy=inputbar_textarea]').type(messageChatplugin);
      cy.get('[data-cy=inputbar_button]').click();
    });
    it('Opens conversation in Inbox', {baseUrl: 'http://ui.airy'}, () => {
      cy.visit('/login');
      cy.get('form')
        .within(() => {
          cy.get('input[type=email]').type(Cypress.env('username'));
          cy.get('input[type=password]').type(Cypress.env('password'));
        })
        .submit();
      cy.get('[data-cy=message_text_area]').type(messageInbox);
      cy.get('[data-cy=message_send_button]').click();
      cy.get('[data-cy=message_list]').children().its('length').should('be.gte', 2);
    });
  }
);
