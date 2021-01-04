export type ColorTag = 'tag-blue' | 'tag-red' | 'tag-green' | 'tag-purple';

export interface Tag {
  id: string;
  name: string;
  color: ColorTag;
}
