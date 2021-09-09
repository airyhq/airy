import {isImageMessage} from '../types/messageTypes';

const image = ['jpeg', 'jpg', 'gif', 'png', 'ico', 'psd', 'svg', 'tiff', 'tif'];
const video = ['mp4', '3gp', 'ogg'];
const audio = ['mp3', 'ogg', 'wav'];
const file = ['pdf', 'cvc', 'doc', 'docx', 'rtf', 'tex', 'wpd'];

export const getAttachmentType = (url: string) => {
  const arr = url.split('.');
  const extension = arr[arr.length - 1];

  if (image.includes(extension)) {
    return 'image';
  }

  if (video.includes(extension)) {
    return 'video';
  }

  if (audio.includes(extension)) {
    return 'audio';
  }

  if (file.includes(extension)) {
    return 'file';
  }
};
