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
            'getting-started/installation/terraform',
            'getting-started/installation/helm',
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
            'sources/chatplugin/messageExamples',
            'sources/chatplugin/customization',
          ],
        },
        'sources/facebook',
        'sources/instagram',
        'sources/google',
        'sources/whatsapp-twilio',
        'sources/sms-twilio',
        'sources/viber',
        'ui/control-center/connectors',
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
            'api/endpoints/users',
            'api/endpoints/contacts',
            'api/endpoints/client-config',
            'api/endpoints/components',
            'api/endpoints/cluster',
          ],
        },
        'api/httpClient',
        'api/websocket',
        'api/webhook',
        'api/source',
      ],
    },
    {
      '💎 UI': [
        'ui/overview',
        {
          Inbox: [
            'ui/inbox/introduction',
            'ui/inbox/messenger',
            'ui/inbox/suggestedReplies',
            'ui/inbox/tags',
            'ui/inbox/contacts',
          ],
        },
        {
          'Control Center': [
            'ui/control-center/introduction',
            'ui/control-center/status',
            'ui/control-center/connectors',
            'ui/control-center/catalog',
            'ui/control-center/webhooks',
          ],
        },
      ],
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
      '📚 Guides': [
        'guides/contributing',
        'guides/analytics-demo',
        'guides/monitoring',
        'guides/backup',
        'guides/component-reset',
      ],
    },
    'changelog',
  ],
};
