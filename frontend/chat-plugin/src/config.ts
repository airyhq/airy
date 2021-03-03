export type RenderCtrl = {
  toggleHideChat: () => void;
};

export type RenderProp = (ctrl?: RenderCtrl) => JSX.Element;

export type AuthConfiguration = {
  channelId: string;
  welcomeMessage?: {};
};

export type AiryWidgetConfiguration = AuthConfiguration & {
  headerBarProp?: RenderProp;
  inputBarProp?: RenderProp;
  airyMessageProp?: RenderProp;
  bubbleProp?: RenderProp;
};
