/* tslint:disable */
/* eslint-disable */

// Generated using typescript-generator version 2.26.723 on 2021-01-19 11:27:56.

export interface Audio extends Content, DataUrl {
  type: 'audio';
}

export interface Content {
  type: 'audio' | 'file' | 'image' | 'source.template' | 'text' | 'video';
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

export interface SourceTemplate extends Content {
  type: 'source.template';
  payload: any;
}

export interface Text {
  text: string;
}

export interface Video extends Content, DataUrl {
  type: 'video';
}

export type ContentUnion = Text | Audio | File | Image | Video | SourceTemplate;
