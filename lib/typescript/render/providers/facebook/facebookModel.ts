export interface Attachment {
  type: string;
  title?: string;
  url?: string | null;
}
export interface SimpleAttachment {
  type: 'image' | 'video' | 'audio' | 'file' | 'fallback' | 'share' | 'story_mention';
  title?: string;
  url?: string;
  payload?: {title?: string; url?: string} | null;
}

export interface URLButton extends Content {
  type: 'web_url';
  url: string;
  title: string;
}

export interface PostbackButton extends Content {
  type: 'postback';
  title: string;
  payload: string;
}

export interface CallButton extends Content {
  type: 'phone_number';
  title: string;
  payload: string;
}

export interface LoginButton extends Content {
  type: 'account_link';
  url: string;
}

export interface LogoutButton extends Content {
  type: 'account_unlink';
}

export interface GamePlayButton extends Content {
  type: 'game_play';
  title: 'Play';
  payload?: string;
  game_metadata?: {
    player_id?: string;
    context_id?: string;
  };
}

export interface ButtonAttachment extends Attachment {
  type: 'template';
  payload: {
    text: string;
    template_type: 'button';
    buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
  };
}
export interface GenericAttachment extends Attachment {
  type: 'template';
  payload: {
    text: string;
    template_type: 'generic';
    elements: Element[];
  };
}

export interface MediaTemplate extends Content {
  type: 'mediaTemplate';
  media_type: 'video' | 'image';
  url?: string;
  attachment_id?: string;
  buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
}

export interface MediaAttachment extends Attachment {
  type: 'template';
  payload: {
    template_type: 'media';
    elements: MediaTemplate[];
  };
}

export interface Element {
  title: string;
  subtitle?: string;
  image_url?: string;
  default_action?: {
    type: string;
    url?: string;
  };
  buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
}

export interface Content {
  type: string;
  text?: string;
}

export interface TextContent extends Content {
  type: 'text';
}

export interface ImageContent extends Content {
  type: 'image';
  imageUrl: string;
}

export interface AudioContent extends Content {
  type: 'audio';
  audioUrl: string;
}

export interface FileContent extends Content {
  type: 'file';
  fileUrl: string;
}

export interface ImagesContent extends Content {
  type: 'images';
  images: ImageContent[];
}

export interface VideoContent extends Content {
  type: 'video';
  videoUrl: string;
}

export interface QuickReply {
  content_type: string;
  title: string;
  payload: string;
  image_url?: string;
}

export interface QuickRepliesContent extends Content {
  type: 'quickReplies';
  text?: string;
  attachment?: AttachmentUnion;
  quickReplies: QuickReply[];
}

export interface ButtonTemplate extends Content {
  type: 'buttonTemplate';
  text: string;
  buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
}

export interface GenericTemplate extends Content {
  type: 'genericTemplate';
  text?: string;
  elements: Element[];
}

export interface Fallback extends Content {
  type: 'fallback';
  text?: string;
  title: string;
  url: string;
}

//Instagram-specific
export interface StoryMentionContent extends Content {
  type: 'story_mention';
  url: string;
  sentAt: Date;
}

export interface StoryRepliesContent extends Content {
  type: 'story_replies';
  url: string;
  sentAt: Date;
}

export interface ShareContent extends Content {
  type: 'share';
  url: string;
}

export interface DeletedMessageContent extends Content {
  type: 'deletedMessage';
}

// Add a new facebook content model here:
export type ContentUnion =
  | TextContent
  | PostbackButton
  | ImageContent
  | AudioContent
  | ImagesContent
  | VideoContent
  | FileContent
  | ButtonTemplate
  | GenericTemplate
  | QuickRepliesContent
  | MediaTemplate
  | StoryMentionContent
  | StoryRepliesContent
  | ShareContent
  | Fallback
  | DeletedMessageContent;

export type AttachmentUnion =
  | TextContent
  | ImageContent
  | VideoContent
  | FileContent
  | AudioContent
  | ButtonTemplate
  | GenericTemplate
  | MediaTemplate
  | Fallback
  | StoryMentionContent
  | ShareContent;
