export const attachmentsExtensions = {
  //facebook
  facebookImageExtensions: ['jpeg', 'jpg', 'gif', 'png', 'webp', 'heic'],
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
    'tiff',
    'tif',
  ],

  //instagram
  instagramImageExtensions: ['jpeg', 'jpg', 'png', 'ico', 'bmp'],

  //twilio.whatsapp
  twilioWhatsappImageExtensions: ['jpeg', 'jpg', 'png'],
  twilioWhatsappVideoExtensions: ['mp4'],
  twilioWhatsappAudioExtensions: ['mp3', 'ogg', 'amr'],
  twilioWhatsappFileExtensions: ['pdf', 'vcf'],

  //google
  googleImageExtensions: ['jpeg', 'jpg', 'png'],
};

export const getAttachmentType = (fileName: string, source: string) => {
  const fileNameArr = fileName.split('.');
  const fileNameExtension = fileNameArr[fileNameArr.length - 1];

  if (source === 'twilio.whatsapp') source = 'twilioWhatsapp';

  const imageFiles = attachmentsExtensions[source + 'ImageExtensions'];
  const videoFiles = attachmentsExtensions[source + 'VideoExtensions'];
  const audioFiles = attachmentsExtensions[source + 'AudioExtensions'];
  const docsFiles = attachmentsExtensions[source + 'FileExtensions'];

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
