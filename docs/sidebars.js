module.exports = {
  docs: [
    'index',
    'user-guide',
    {API: ['api/http', 'api/websocket', 'api/webhook']},
    {
      Sources: [
        'sources/facebook',
        'sources/google',
        'sources/chat-plugin',
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
