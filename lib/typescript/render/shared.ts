import {isFromContact, RenderedContentUnion, Contact} from 'httpclient';
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
  contentType: 'message' | 'template';
  renderedContent: RenderedContentUnion;
  source: string;
}

export interface MessageRenderProps extends RenderProps {
  contentType: 'message';
  contact?: Contact;
  lastInGroup: boolean;
  invertSides?: boolean;
  commandCallback?: (command: CommandUnion) => void;
}

export interface TemplateRenderProps extends RenderProps {
  contentType: 'template';
}

export type RenderPropsUnion = MessageRenderProps | TemplateRenderProps;

export const getDefaultRenderingProps = (props: RenderPropsUnion): DefaultRenderingProps => {
  const fromContact = isFromContact(props.renderedContent);

  return {
    fromContact,
  };
};
