//remove this when components.list endpoint has been added

interface ComponentInfo {
  repository: string;
  installed: boolean;
}

export interface ComponentList {
  components: {
    [key: string]: ComponentInfo;
  };
}

export const componentsListMock: ComponentList = {
  components: {
    'sources-chatplugin': {
      repository: 'airy-core',
      installed: true,
    },
    'sources-facebook': {
      repository: 'airy-core',
      installed: true,
    },
    'sources-twilio': {
      repository: 'airy-core',
      installed: true,
    },
    'sources-google': {
      repository: 'airy-core',
      installed: true,
    },
    'dialogflow-connector': {
      repository: 'enterprise',
      installed: true,
    },
  },
};
