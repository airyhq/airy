export interface OutboundContent {
  type: 'text' | 'media';
}

export interface TextContent extends OutboundContent {
  type: 'text';
  text: string;
}

export interface MediaContent extends OutboundContent {
  type: 'media';
  mediaUrl: string;
}

export type OutboundUnion = TextContent | MediaContent;
