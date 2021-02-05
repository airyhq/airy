export enum ContentType {
  text = 'text',
  richText = 'richText',
}

export interface Content {
  type: ContentType;
}

export interface TextContent extends Content {
  type: ContentType.text;
  text: string;
}

export interface RichtTextContent extends Content {
  type: ContentType.richText;
  text: string;
  fallback: string;
  containsRichtText: boolean;
}

// TODO add a new chatplugin content model here

export type ContentUnion = TextContent | RichtTextContent;
