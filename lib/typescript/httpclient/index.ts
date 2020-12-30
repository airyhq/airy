import {
  getChannels,
  exploreChannels,
  connectChannel,
  disconnectChannel,
  fetchConversations,
  fetchNextConversations,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  loginViaEmail,
} from './endpoints';

export const HttpClient = (function() {
  return {
    getChannels: getChannels,
    exploreChannels: exploreChannels,
    connectChannel: connectChannel,
    disconnectChannel: disconnectChannel,
    fetchConversations: fetchConversations,
    fetchNextConversations: fetchNextConversations,
    getTags: getTags,
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
