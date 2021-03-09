import {ListTagsResponsePayload} from '../payload';
import {Tag} from '../model';
import {HttpClient} from '../client';

export default HttpClient.prototype.listTags = async function () {
  const response: ListTagsResponsePayload = await this.doFetchFromBackend('tags.list');

  const tagMapper = {
    BLUE: 'tag-blue',
    RED: 'tag-red',
    GREEN: 'tag-green',
    PURPLE: 'tag-purple',
  };

  const tagsMapper = (serverTags: Tag[]): Tag[] => {
    return serverTags.map(t => ({id: t.id, name: t.name, color: tagMapper[t.color] || 'tag-blue'}));
  };

  return tagsMapper(response.data);
};
