export interface Content {
  type: 'text' | 'richText';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

export interface RichtTextContent extends Content {
  type: 'richText';
  text: string;
  fallback: string;
  containsRichtText: boolean;
}

// TODO add a new chatplugin content model here

export type ContentUnion = TextContent | RichtTextContent;
