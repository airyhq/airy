import {
  listChannels,
  exploreChannels,
  connectChannel,
  disconnectChannel,
  listConversations,
  readConversations,
  listMessages,
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
    readConversations: readConversations,
    listMessages: listMessages,
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
