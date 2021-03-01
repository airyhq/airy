import {TagPayload, CreateTagRequestPayload} from '../payload';
import {TagColor} from '../model';
import {HttpClient} from '../client';

export default HttpClient.prototype.createTag = async function createTag(requestPayload: CreateTagRequestPayload) {
  const response: TagPayload = await this.doFetchFromBackend('tags.create', requestPayload);
  return {
    id: response.id,
    name: requestPayload.name,
    color: requestPayload.color as TagColor,
  };
};
