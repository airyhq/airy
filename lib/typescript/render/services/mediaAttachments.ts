export const mediaAttachmentsExtensions = {
  //facebook
  facebookImageExtensions: ['jpeg', 'jpg', 'gif', 'png', 'tiff', 'tif', 'webp'],
  facebookVideoExtensions: ['mp4', 'mov', 'wmv'],
  facebookAudioExtensions: ['mp3', 'ogg', 'wav'],
  facebookFileExtensions: [
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
  ],

  //instagram
  instagramImageExtensions: ['jpeg', 'jpg', 'png', 'ico', 'bmp', 'gif'],

  //twilio.whatsapp
  twilioWhatsappImageExtensions: ['jpeg', 'jpg', 'png'],
  twilioWhatsappVideoExtensions: ['mp4'],
  twilioWhatsappAudioExtensions: ['mp3', 'ogg', 'amr'],
  twilioWhatsappFileExtensions: ['pdf'],
};

export const getAttachmentType = (fileName: string, source: string) => {
  const fileNameArr = fileName.split('.');
  const fileNameExtension = fileNameArr[fileNameArr.length - 1];

  if (source === 'twilio.whatsapp') source = 'twilioWhatsapp';

  const imageFiles = mediaAttachmentsExtensions[source + 'ImageExtensions'];
  const videoFiles = mediaAttachmentsExtensions[source + 'VideoExtensions'];
  const audioFiles = mediaAttachmentsExtensions[source + 'AudioExtensions'];
  const docsFiles = mediaAttachmentsExtensions[source + 'FileExtensions'];

  if (imageFiles && imageFiles.includes(fileNameExtension)) {
    return 'image';
  }

  if (videoFiles && videoFiles.includes(fileNameExtension)) {
    return 'video';
  }

  if (audioFiles && audioFiles.includes(fileNameExtension)) {
    return 'audio';
  }

  if (docsFiles && docsFiles.includes(fileNameExtension)) {
    return 'file';
  }
};

export const getFileName = (fileUrl: string) => {
  const fileUrlArr = fileUrl.split('/');

  return fileUrlArr[fileUrlArr.length - 1].split('?')[0];
};
