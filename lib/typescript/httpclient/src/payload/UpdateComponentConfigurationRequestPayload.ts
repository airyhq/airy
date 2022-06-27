export interface UpdateComponentConfigurationRequestPayload {
  components: {name: string; enabled: boolean; data: {[key: string]: string}}[];
}
