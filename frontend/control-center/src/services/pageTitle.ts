export const setPageTitle = (title?: string) => {
  if (title?.length) {
    document.title = `Airy UI - Control Center - ${title}`;
  } else {
    document.title = 'Airy UI - Control Center';
  }
};
