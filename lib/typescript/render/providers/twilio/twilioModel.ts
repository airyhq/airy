export interface Content {
  type: 'text';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

export type ContentUnion = TextContent;
