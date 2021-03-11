import {Tag} from '../model';
import {HttpClient} from '../client';

export default HttpClient.prototype.updateTag = function (tag: Tag) {
  return this.doFetchFromBackend('tags.update', {...tag});
};
