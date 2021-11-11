export interface Content {
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'currentLocation';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

export interface ImageContent extends Content {
  type: 'image';
  text?: string;
  imageUrl: string;
}

export interface VideoContent extends Content {
  type: 'video';
  text?: string;
  videoUrl: string;
}

export interface FileContent extends Content {
  type: 'file';
  fileType?: string;
  fileUrl: string;
}

export interface AudioContent extends Content {
  type: 'audio';
  audioUrl: string;
}

export interface CurrentLocation extends Content {
  type: 'currentLocation';
  latitude: string;
  longitude: string;
}

export type ContentUnion = TextContent | ImageContent | FileContent | VideoContent | AudioContent | CurrentLocation;
