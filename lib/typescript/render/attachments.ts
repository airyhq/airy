export const imageExtensions = ['jpeg', 'jpg', 'gif', 'png', 'tiff', 'tif'];
export const instagramImageExtensions = ['jpeg', 'jpg', 'png', 'ico', 'bmp', 'gif'];
export const videoExtensions = ['mp4', 'mov', 'wmv'];
export const audioExtensions = ['mp3', 'ogg', 'wav'];
export const fileExtensions = [
  'pdf',
  'cvc',
  'doc',
  'docx',
  'rtf',
  'tex',
  'wpd',
  'psd',
  'svg',
  'ico',
  'json',
  'md',
  'mdx',
  'tsx',
  'jsx',
  'js',
  'ts',
  'css',
  'scss',
  'html',
  'bmp',
];

export const getAttachmentType = (url: string) => {
  const urlArr = url.split('.');
  const extension = urlArr[urlArr.length - 1];

  if (imageExtensions.includes(extension)) {
    return 'image';
  }

  if (videoExtensions.includes(extension)) {
    return 'video';
  }

  if (audioExtensions.includes(extension)) {
    return 'audio';
  }

  if (fileExtensions.includes(extension)) {
    return 'file';
  }
};

export const isSupportedByInstagramMessenger = (url: string) => {
  const urlArr = url.split('.');
  const extension = urlArr[urlArr.length - 1];
  
  return instagramImageExtensions.includes(extension) ? true : false;
};

export const getFileName = (fileUrl: string) => {
  const fileUrlArr = fileUrl.split('/');

  return fileUrlArr[fileUrlArr.length - 1].split('?')[0];
};
