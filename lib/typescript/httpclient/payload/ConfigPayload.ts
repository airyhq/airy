export interface ConfigPayload {
  components: {
    'sources-chatplugin': {
      enabled: boolean;
    };
    'sources-facebook': {
      enabled: boolean;
    };
    'sources-google': {
      enabled: boolean;
    };
    'sources-twilio': {
      enabled: boolean;
    };
  };
  features: {};
}
