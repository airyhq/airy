export interface Tag {
  id?: string;
  name: string;
  color: string;
  count?: number;
}

export interface TagPayload {
  id: string;
}

export interface CreateTagRequestPayload {
  name: string;
  color: string;
}

export interface GetTagsResponse {
  data: Tag[];
}

export const tagsMapper = (serverTags: Tag[]): Tag[] => {
  const tags: Tag[] = [];
  const tags2 = serverTags.map((tag: Tag) => {
    tag.color = colorMapper(tag.color);
    tags.push(tag);
  });
  return tags;
};

export const colorMapper = (color: string): string => {
  switch (color) {
    case 'BLUE':
      color = 'tag-blue';
      break;
    case 'RED':
      color = 'tag-red';
      break;
    case 'GREEN':
      color = 'tag-green';
      break;
    case 'PURPLE':
      color = 'tag-purple';
      break;
  }
  return color;
};
