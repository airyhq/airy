import {HttpClient} from '../../client';

export default HttpClient.prototype.deleteTag = function deleteTag(id: string) {
  return this.doFetchFromBackend('tags.delete', {id});
};
