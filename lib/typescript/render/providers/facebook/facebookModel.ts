export interface Content {
  type: 'text';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

// TODO add a new facebook content model here

export type ContentUnion = TextContent;
