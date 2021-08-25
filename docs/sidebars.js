module.exports = {
  docs: [
    {
      '🚀 Getting Started': [
        'getting-started/introduction',
        'getting-started/components',
        {
          'Setup & Deployment': [
            'getting-started/installation/introduction',
            'getting-started/installation/minikube',
            'getting-started/installation/aws',
            'getting-started/installation/configuration',
            'getting-started/installation/security',
          ],
        },
        {
          'Command Line Interface': ['cli/introduction', 'cli/usage'],
        },
        'getting-started/quickstart',
        'getting-started/upgrade',
        'getting-started/troubleshooting',
        'getting-started/glossary',
      ],
    },
    {
      '💬 Sources': [
        'sources/introduction',
        {
          'Airy Live Chat Plugin': [
            'sources/chatplugin/overview',
            'sources/chatplugin/demo',
            'sources/chatplugin/quickstart',
            'sources/chatplugin/installation',
            'sources/chatplugin/customization',
          ],
        },
        'sources/facebook',
        'sources/instagram',
        'sources/google',
        'sources/sms-twilio',
        'sources/whatsapp-twilio',
        'sources/viber',
        'ui/channels',
      ],
    },
    {
      '🔌 API': [
        'api/introduction',
        {
          'HTTP Endpoints': [
            'api/endpoints/introduction',
            'api/endpoints/channels',
            'api/endpoints/chatplugin',
            'api/endpoints/conversations',
            'api/endpoints/messages',
            'api/endpoints/attachments',
            'api/endpoints/metadata',
            'api/endpoints/tags',
            'api/endpoints/templates',
          ],
        },
        'api/websocket',
        'api/webhook',
      ],
    },
    {
      '💎 UI': ['ui/introduction', 'ui/inbox', 'ui/channels', 'ui/tags', 'ui/suggestedReplies'],
    },
    {
      '🛠️ Integrations': [
        {
          'Conversational AI /NLP': ['integrations/rasa-assistant', 'integrations/rasa-suggested-replies'],
        },
      ],
    },
    {
      '⚙️ Concepts': [
        'concepts/architecture',
        'concepts/design-principles',
        'concepts/release-process',
        'concepts/kafka',
        'concepts/metadata',
      ],
    },
    {
      '📚 Guides': ['guides/contributing'],
    },
    'changelog',
  ],
};
