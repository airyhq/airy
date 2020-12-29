import { doFetchFromBackend } from '../api';

export function deleteTag(id: string) {
  return doFetchFromBackend('tags.delete', {
    id,
  })
  .then(() => Promise.resolve(true))
  .catch((error: Error) => Promise.reject(error))
};