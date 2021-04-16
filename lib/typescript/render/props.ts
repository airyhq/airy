import {Content} from 'model';
export interface Command {
  type: string;
}

export interface SuggestedReplyCommand extends Command {
  type: 'suggestedReply';
  payload: {
    text: string;
    postbackData: string;
  };
}

export interface QuickReplyCommand extends Command {
  type: 'quickReplies';
  payload: {
    text: string;
    postbackData: string;
  };
}

export type CommandUnion = SuggestedReplyCommand | QuickReplyCommand;

interface RenderProps {
  contentType: 'message' | 'template' | 'suggestedReplies' | 'quickReplies';
  content: Content;
  source: string;
}

export interface MessageRenderProps extends RenderProps {
  contentType: 'message';
  invertSides?: boolean;
  commandCallback?: (command: CommandUnion) => void;
}

export interface TemplateRenderProps extends RenderProps {
  contentType: 'template';
}

export interface SuggestedRepliesRenderProps extends RenderProps {
  contentType: 'suggestedReplies';
}
export interface QuickRepliesRenderProps extends RenderProps {
  contentType: 'quickReplies';
}

export type RenderPropsUnion =
  | MessageRenderProps
  | TemplateRenderProps
  | SuggestedRepliesRenderProps
  | QuickRepliesRenderProps;
