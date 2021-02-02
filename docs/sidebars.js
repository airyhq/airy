module.exports = {
  docs: [
    {
      '🚀 Getting Started': [
        'getting-started/introduction',
        'getting-started/installation',
        {
          Deployment: ['getting-started/deployment/test-environment', 'getting-started/deployment/prod-environment'],
        },
        'getting-started/quickstart',
        {
          CLI: [
            'getting-started/cli',
            'cli/airy',
            'cli/airy_version',
            'cli/airy_init',
            'cli/airy_config',
            'cli/airy_config_apply',
            'cli/airy_api',
            'cli/airy_api_signup',
            'cli/airy_api_login',
            'cli/airy_status',
          ],
        },
        'getting-started/troubleshooting',
        'getting-started/glossary',
      ],
    },
    {
      '💬 Sources': [
        'sources/introduction',
        'sources/chat-plugin',
        'sources/facebook',
        'sources/google',
        'sources/sms-twilio',
        'sources/whatsapp-twilio',
      ],
    },
    {
      '🔌 API': [
        'api/introduction',
        'api/authentication',
        {
          'HTTP Endpoints': [
            'api/endpoints/introduction',
            'api/endpoints/channels',
            'api/endpoints/conversations',
            'api/endpoints/messages',
            'api/endpoints/metadata',
            'api/endpoints/tags',
            'api/endpoints/users',
          ],
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
          'Conversational AI /NLP': ['integrations/rasa'],
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
