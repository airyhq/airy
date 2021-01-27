module.exports = {
  docs: [
    {
      Home: 'index.md',
      '🚀 Getting Started': [
        {
          Introduction: ['getting-started/introduction/what-airy-is', 'getting-started/introduction/components'],
        },
        'getting-started/installation',
        {
          Deployment: ['getting-started/deployment/test-environment', 'getting-started/deployment/prod-environment'],
        },
        'getting-started/quickstart',
        'getting-started/cli',
        'getting-started/troubleshooting',
        'getting-started/glossary',
      ],
    },
    {
      '💬 Sources': [
        'sources/chat-plugin',
        'sources/facebook',
        'sources/google',
        'sources/sms-twilio',
        'sources/whatsapp-twilio',
      ],
    },
    {
      '🔌 API': [
        {
          HTTP: ['api/http/introduction', 'api/http/endpoints'],
        },
        'api/websocket',
        'api/webhook',
      ],
    },
    {
      '✨ Apps': ['apps/ui'],
    },
    {
      '🛠️ Integrations': [
        {
          'Conversational AI /NLP': ['integrations/airy-core-and-rasa'],
        },
      ],
    },
    {
      '⚙️ Concepts': [
        'concepts/architecture',
        'concepts/design-principles',
        'concepts/release-process',
        'concepts/kafka',
      ],
    },
    {
      '📚 Guides': ['guides/contributing'],
    },
  ],
};
