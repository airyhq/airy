export interface SettingsEntry {
  enabled?: boolean;
  send_on_enter?: boolean;
  show_notifications?: boolean;
}

export interface Settings {
  [name: string]: SettingsEntry;
}
