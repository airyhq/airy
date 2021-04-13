import {CreateTagRequestPayload} from './payload';
import {HttpClient} from '../../client';
import {TagColor} from './model';

export default HttpClient.prototype.createTag = async function createTag(requestPayload: CreateTagRequestPayload) {
  const response = await this.doFetchFromBackend('tags.create', requestPayload);
  return {
    id: response.id,
    name: requestPayload.name,
    color: requestPayload.color as TagColor,
  };
};
