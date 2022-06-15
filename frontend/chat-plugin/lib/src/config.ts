export type RenderCtrl = {
  toggleHideChat: () => void;
};

export type RenderProp = (ctrl?: RenderCtrl) => JSX.Element;

export enum CloseOption {
  basic = 'basic',
  medium = 'medium',
  full = 'full',
}

export enum BubbleState {
  minimized = 'minimized',
  expanded = 'expanded',
}

export enum DefaultColors {
  headerTextColor = '#FFFFFF',
  subtitleTextColor = '#FFFFFF',
  primaryColor = '#1578D4',
  accentColor = '#1578D4',
  backgroundColor = '#FFFFFF',
  inboundMessageColor = '#F1FAFF',
  inboundMessageTextColor = '#000000',
  outboundMessageColor = '#1578D4',
  outboundMessageTextColor = '#FFFFFF',
  unreadMessageDotColor = '#FF0000',
}

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
  unreadMessageDotColor?: string;
  sendMessageIcon?: string;
  showMode?: boolean;
  height?: number | string;
  width?: number | string;
  disableMobile?: boolean;
  bubbleState?: 'expanded' | 'minimized';
  closeMode?: 'basic' | 'medium' | 'full';
  hideInputBar?: boolean;
  hideEmojis?: boolean;
  useCustomFont?: boolean;
  customFont?: string;
  hideAttachments?: boolean;
  hideImages?: boolean;
  hideVideos?: boolean;
  hideFiles?: boolean;
};

export const DefaultConfig: Config = {
  welcomeMessage: '',
  startNewConversationText: '',
  headerText: '',
  subtitleText: '',
  headerTextColor: DefaultColors.headerTextColor,
  subtitleTextColor: DefaultColors.subtitleTextColor,
  primaryColor: DefaultColors.primaryColor,
  accentColor: DefaultColors.accentColor,
  backgroundColor: DefaultColors.backgroundColor,
  inboundMessageColor: DefaultColors.inboundMessageColor,
  inboundMessageTextColor: DefaultColors.inboundMessageTextColor,
  outboundMessageColor: DefaultColors.outboundMessageColor,
  outboundMessageTextColor: DefaultColors.outboundMessageTextColor,
  unreadMessageDotColor: DefaultColors.unreadMessageDotColor,
  sendMessageIcon: '',
  showMode: false,
  height: '700',
  width: '380',
  disableMobile: false,
  bubbleState: BubbleState.expanded,
  bubbleIcon: '',
  closeMode: CloseOption.full,
  hideInputBar: false,
  hideEmojis: false,
  useCustomFont: true,
  customFont: 'Lato',
  hideAttachments: false,
  hideImages: false,
  hideVideos: false,
  hideFiles: false,
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
