export type RenderCtrl = {
  toggleHideChat: () => void;
};

export type RenderProp = (ctrl?: RenderCtrl) => preact.JSX.Element;

export type AuthConfiguration = {
  channel_id: string;
};

export type AiryWidgetConfiguration = AuthConfiguration & {
  headerBarProp?: RenderProp;
  inputBarProp?: RenderProp;
  airyMessageProp?: RenderProp;
  bubbleProp?: RenderProp;
};
