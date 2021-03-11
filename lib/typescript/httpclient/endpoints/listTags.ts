import {HttpClient} from '../client';

export default HttpClient.prototype.listTags = async function () {
  const response = await this.doFetchFromBackend('tags.list');

  const tagMapper = {
    BLUE: 'tag-blue',
    RED: 'tag-red',
    GREEN: 'tag-green',
    PURPLE: 'tag-purple',
  };

  return response.data.map(t => ({id: t.id, name: t.name, color: tagMapper[t.color] || 'tag-blue'}));
};
