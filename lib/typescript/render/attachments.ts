const imageExtensions = ['jpeg', 'jpg', 'gif', 'png', 'ico', 'psd', 'svg', 'tiff', 'tif'];
const videoExtensions = ['mp4', '3gp', 'ogg'];
const audioExtensions = ['mp3', 'ogg', 'wav'];
const fileExtensions = ['pdf', 'cvc', 'doc', 'docx', 'rtf', 'tex', 'wpd'];

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
  console.log('fileUrl', fileUrl);
  const fileUrlArr = fileUrl.split('/');
  const fileName = fileUrlArr[fileUrlArr.length - 1];

  return fileName;
};
