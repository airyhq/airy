export const getResumeTokenFromStorage = (channelId: string): string => {
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.has('resume_token')) {
    setResumeTokenInStorage(channelId, queryParams.get('resume_token'));
  }
  return localStorage.getItem(getResumeTokenKey(channelId));
};

export const setResumeTokenInStorage = (channelId: string, resumeToken: string) => {
  localStorage.setItem(getResumeTokenKey(channelId), resumeToken);
};

const getResumeTokenKey = (channelId: string) => `resume_token_${channelId}`;

export const resetStorage = (channelId: string) => {
  localStorage.removeItem(getResumeTokenKey(channelId));
};
