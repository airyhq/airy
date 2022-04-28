export const setPageTitle = (title?: string) => {
  if (title?.length) {
    document.title = `Control Center - ${title}`;
  } else {
    document.title = 'Control Center';
  }
};
