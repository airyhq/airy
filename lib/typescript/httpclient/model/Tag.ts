export type ColorTag = 'tag-blue' | 'tag-red' | 'tag-green' | 'tag-purple' | string;

export interface Tag {
  id: string;
  name: string;
  color: ColorTag;
}
