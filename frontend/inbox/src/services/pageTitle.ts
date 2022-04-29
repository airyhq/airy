export const setPageTitle = (title?: string) => {
  if (title?.length) {
    document.title = `Inbox - ${title}`;
  } else {
    document.title = 'Inbox';
  }
};
