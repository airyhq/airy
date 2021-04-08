export type TagColor = 'tag-blue' | 'tag-red' | 'tag-green' | 'tag-purple';

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}
