import {Tag} from '../model';
import {HttpClient} from '../client';

export default HttpClient.prototype.updateTag = async function(tag: Tag) {
  await this.doFetchFromBackend('tags.update', {...tag});
  return Promise.resolve(true);
};
