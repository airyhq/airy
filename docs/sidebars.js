module.exports = {
  docs: [
    'index',
    'user-guide',
    {
      API: ['api/http', 'api/websocket', 'api/webhook'],
    },
    {
      Sources: [
        'sources/chat-plugin',
        'sources/facebook',
        'sources/google',
        'sources/sms-twilio',
        'sources/whatsapp-twilio',
      ],
    },
    {
      Guidelines: [
        'guidelines/contributing',
        'guidelines/design-principles',
        'guidelines/release-process',
        'guidelines/kafka',
      ],
    },
    'glossary',
  ],
};
