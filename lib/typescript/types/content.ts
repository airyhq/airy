/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.26.723 on 2021-01-13 15:17:35.

export interface Audio extends Content, DataUrl {
  type: 'audio';
}

export interface Content {
  type: 'audio' | 'file' | 'image' | 'text' | 'video';
}

export interface DataUrl {
  url: string;
}

export interface File extends Content, DataUrl {
  type: 'file';
}

export interface Image extends Content, DataUrl {
  type: 'image';
}

export interface Text extends Content {
  type: 'text';
  text: string;
}

export interface Video extends Content, DataUrl {
  type: 'video';
}

export type ContentUnion = Text | Audio | File | Image | Video;
