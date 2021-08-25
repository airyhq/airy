export interface Content {
  type: 'text' | 'picture' | 'video' | 'contact';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

export interface PictureContent extends Content {
  type: 'picture';
  text: string;
  media: string;
  thumbnail?: string;
}

export interface VideoContent extends Content {
  type: 'video';
  text: string;
  media: string;
  thumbnail?: string;
  size: number;
  duration: 10;
}

export interface ContactContent extends Content {
  type: 'contact';
  contact: {
    name: string;
    phone_number: string;
  };
}

export type ContentUnion = TextContent | PictureContent | VideoContent | ContactContent;
