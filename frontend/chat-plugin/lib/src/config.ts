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
  outboundMessageColor?: string;
  inboundMessageColor?: string;
  outboundMessageTextColor?: string;
  inboundMessageTextColor?: string;
  sendMessageIcon?: string;
  showMode?: boolean;
  height?: number;
  width?: number;
  disableMobile?: boolean;
  bubbleState?: 'expanded' | 'minimized';
  closeMode?: 'basic' | 'medium' | 'full';
  hideInputBar?: boolean;
  hideEmojis?: boolean;
  hideAttachments?: boolean;
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
