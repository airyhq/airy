export type TagColor = 'tag-blue' | 'tag-red' | 'tag-green' | 'tag-purple';

export type TagInitialState = {
  modal?: {
    type?: string;
    tagId?: string;
    tagName?: string;
    delete?: string;
    error?: string;
  };
  filteredTags?: Tag[];
  emptyState?: boolean;
};

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}
