const imageExtensions = ['jpeg', 'jpg', 'gif', 'png', 'tiff', 'tif'];
const videoExtensions = ['mp4', 'mov', 'wmv'];
const audioExtensions = ['mp3', 'ogg', 'wav'];
const fileExtensions = ['pdf', 'cvc', 'doc', 'docx', 'rtf', 'tex', 'wpd', 'psd', 'svg', 'ico'];

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

export const getFileName = (fileUrl: string) => {
  const fileUrlArr = fileUrl.split('/');

  return fileUrlArr[fileUrlArr.length - 1].split('?')[0];
};
