declare namespace Cypress {
  interface Chainable<Subject> {
    createChatPluginConversation(): Chainable<Subject>;
    editContactDetails(): Chainable<Subject>;
    connectChatPluginConnector(): Chainable<Subject>;
    editDisplayName(): Chainable<Subject>;
    listConversationsForContact(): Chainable<Subject>;
  }
}
