import {
  listChannels,
  exploreChannels,
  connectChannel,
  disconnectChannel,
  listConversations,
  listTags,
  createTag,
  updateTag,
  deleteTag,
  loginViaEmail,
} from './endpoints';

export const HttpClient = (function() {
  return {
    listChannels: listChannels,
    exploreChannels: exploreChannels,
    connectChannel: connectChannel,
    disconnectChannel: disconnectChannel,
    listConversations: listConversations,
    listTags: listTags,
    createTag: createTag,
    updateTag: updateTag,
    deleteTag: deleteTag,
    loginViaEmail: loginViaEmail,
  };
})();

export * from './api';
export * from './model';
export * from './endpoints';
export * from './payload';
