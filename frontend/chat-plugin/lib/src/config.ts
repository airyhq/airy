export type RenderCtrl = {
  toggleHideChat: () => void;
};

export type RenderProp = (ctrl?: RenderCtrl) => JSX.Element;

export type Config = {
  welcomeMessage?: {};
  headerText?: string;
  subtitleText?: string;
  subtitleTextColor?: string;
  startNewConversationText?: string;
  headerTextColor?: string;
  backgroundColor?: string;
  primaryColor?: string;
  accentColor?: string;
  bubbleIcon?: string;
  sendMessageIcon?: string;
  showMode?: boolean;
  height?: number;
  width?: number;
  disableMobile?: boolean;
  bubbleState?: string;
};

export type AuthConfiguration = {
  channelId: string;
  resumeToken?: string;
};

export type AiryChatPluginConfiguration = AuthConfiguration & {
  apiHost: string;
  config?: Config;
  headerBarProp?: RenderProp;
  inputBarProp?: RenderProp;
  airyMessageProp?: RenderProp;
  bubbleProp?: RenderProp;
};
