
//refactor this 

//source + 

//facebook
export const facebookImageExtensions = ['jpeg', 'jpg', 'gif', 'png', 'tiff', 'tif'];
export const facebookVideoExtensions = ['mp4', 'mov', 'wmv'];
export const facebookAudioExtensions = ['mp3', 'ogg', 'wav'];
export const facebookFileExtensions = [
  'pdf',
  'cvc',
  'doc',
  'docx',
  'rtf',
  'tex',
  'txt',
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


export const instagramImageExtensions = ['jpeg', 'jpg', 'png', 'ico', 'bmp', 'gif'];

export const getAttachmentType = (url: string, source: string) => {
  const urlArr = url.split('.');
  const extension = urlArr[urlArr.length - 1];

  if ( source + ImageExtensions && source + imageExtensions.includes(extension)) {
    return 'image';
  }

  if (source + videoExtensions && source + videoExtensions.includes(extension)) {
    return 'video';
  }

  if (source + audioExtensions && source + audioExtensions.includes(extension)) {
    return 'audio';
  }

  if (source + fileExtensions && source + fileExtensions.includes(extension)) {
    return 'file';
  }
};

// export const isSupportedByInstagramMessenger = (url: string) => {
//   const urlArr = url.split('.');
//   const extension = urlArr[urlArr.length - 1];

//   return instagramImageExtensions.includes(extension) ? true : false;
// };

export const getFileName = (fileUrl: string) => {
  const fileUrlArr = fileUrl.split('/');

  return fileUrlArr[fileUrlArr.length - 1].split('?')[0];
};
