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
            'getting-started/installation/gcp',
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
      '💬 Connectors': [
        'connectors/overview',
        {
          Sources: [
            'connectors/sources/introduction',
            {
              'Airy Live Chat Plugin': [
                'connectors/sources/chatplugin/overview',
                'connectors/sources/chatplugin/demo',
                'connectors/sources/chatplugin/quickstart',
                'connectors/sources/chatplugin/installation',
                'connectors/sources/chatplugin/messageExamples',
                'connectors/sources/chatplugin/customization',
              ],
            },
            'connectors/sources/facebook',
            'connectors/sources/whatsapp-cloud',
            'connectors/sources/instagram',
            'connectors/sources/google',
            'connectors/sources/whatsapp-twilio',
            'connectors/sources/sms-twilio',
            'connectors/sources/viber',
          ],
        },
        {
          'Conversational AI': [
            'connectors/conversational-ai/introduction',
            'connectors/conversational-ai/cognigy-ai',
            'connectors/conversational-ai/ibm-watson-assistant',
            'connectors/conversational-ai/rasa',
          ],
        },
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
            'api/endpoints/streams',
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
        {
          Testing: ['ui/testing/integration-testing'],
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
        'guides/contributing-to-airy',
        'guides/contributing-components',
        'guides/analytics-demo',
        'guides/monitoring',
        'guides/backup',
        'guides/component-reset',
        'guides/remote-kafka-cluster',
      ],
    },
    'changelog',
  ],
};
