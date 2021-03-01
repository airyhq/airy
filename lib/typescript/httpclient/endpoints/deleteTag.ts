import {HttpClient} from '../client';

export default HttpClient.prototype.deleteTag = async function deleteTag(id: string) {
  await this.doFetchFromBackend('tags.delete', {id});
  return Promise.resolve(true);
};
