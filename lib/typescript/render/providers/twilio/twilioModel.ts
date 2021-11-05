export interface Content {
  type: 'text' | 'image' | 'file';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

export interface ImageContent extends Content {
  type: 'image';
  imageUrl: string;
}

export interface FileContent extends Content {
  type: 'file';
  fileUrl: string;
}

export type ContentUnion = TextContent | ImageContent | FileContent;
