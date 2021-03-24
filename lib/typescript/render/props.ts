import {isFromContact, RenderedContentUnion} from 'httpclient';
import {DefaultRenderingProps} from './components';

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

export type CommandUnion = SuggestedReplyCommand;

interface RenderProps {
  contentType: 'message' | 'template' | 'suggestedReplies';
  content: RenderedContentUnion;
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

export type RenderPropsUnion = MessageRenderProps | TemplateRenderProps | SuggestedRepliesRenderProps;

export const getDefaultRenderingProps = (props: RenderPropsUnion): DefaultRenderingProps => {
  const fromContact = isFromContact(props.content);

  return {
    fromContact,
  };
};
