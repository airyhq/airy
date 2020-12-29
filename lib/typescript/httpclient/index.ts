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
} from './payload';

export const AiryHttpClient = (function() {
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
