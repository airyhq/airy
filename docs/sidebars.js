module.exports = {
  docs: [
    'index',
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
    {
      Guides: [
        'guides/architecture',
        'guides/airy-cli',
        {
          Deployment: ['guides/airy-core-in-test-env', 'guides/airy-core-in-production'],
        },
      ],
    },

    'glossary',
  ],
};
