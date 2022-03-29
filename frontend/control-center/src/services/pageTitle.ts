export const setPageTitle = (title?: string) => {
  if (title?.length) {
    document.title = `Airy UI - ${title}`;
  } else {
    document.title = 'Airy UI';
  }
};
