module.exports = {
  docs: [
    'index',
    {
      Overview: ['overview/architecture', 'overview/design-principles', 'overview/release-process', 'overview/kafka'],
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
      Guides: [
        'guides/contributing',
        {
          Deployment: ['guides/airy-core-in-test-env', 'guides/airy-core-in-production'],
        },
        'guides/airy-core-and-rasa',
      ],
    },
    {
      'API Reference': ['api/http', 'api/websocket', 'api/webhook'],
    },
    'glossary',
  ],
};
