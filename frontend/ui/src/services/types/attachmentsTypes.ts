import {attachmentsExtensions} from 'render';

export const getAllSupportedAttachmentsForSource = (source: string) => {
  if (source === 'twilio.whatsapp') source = 'twilioWhatsapp';

  const imageFiles = attachmentsExtensions[source + 'ImageExtensions'];
  const videoFiles = attachmentsExtensions[source + 'VideoExtensions'];
  const audioFiles = attachmentsExtensions[source + 'AudioExtensions'];
  const docsFiles = attachmentsExtensions[source + 'FileExtensions'];

  const supportedDocsFiles = docsFiles ? docsFiles.join(', ') : '';
  const supportedAudioFiles =
    audioFiles && docsFiles ? audioFiles.join(', ') + ',' : audioFiles ? audioFiles.join(', ') : '';
  const supportedVideoFiles =
    videoFiles && audioFiles ? videoFiles.join(', ') + ',' : videoFiles ? videoFiles.join(', ') : '';
  const supportedImageFiles =
    imageFiles && videoFiles ? imageFiles.join(', ') + ',' : imageFiles ? imageFiles.join(', ') : '';

  return `${supportedImageFiles} ${supportedVideoFiles} ${supportedAudioFiles} ${supportedDocsFiles}`;
};

export const getInputAcceptedFilesForSource = (source: string) => {
  if (source === 'twilio.whatsapp') source = 'twilioWhatsapp';

  const imageFiles = attachmentsExtensions[source + 'ImageExtensions'];
  const videoFiles = attachmentsExtensions[source + 'VideoExtensions'];
  const audioFiles = attachmentsExtensions[source + 'AudioExtensions'];
  const docsFiles = attachmentsExtensions[source + 'FileExtensions'];

  if (!imageFiles && !videoFiles && !audioFiles && !docsFiles) {
    return null;
  }

  const supportedDocsFiles = docsFiles ? '.' + docsFiles.join(', .') : '';
  const supportedAudioFiles = audioFiles ? '.' + audioFiles.join(', .') + ',' : '';
  const supportedVideoFiles = videoFiles ? '.' + videoFiles.join(', .') + ',' : '';
  const supportedImageFiles = imageFiles ? '.' + imageFiles.join(', .') + ',' : '';

  const inputAcceptValue = `${supportedImageFiles} ${supportedVideoFiles} ${supportedAudioFiles} ${supportedDocsFiles}`;

  return inputAcceptValue;
};

export const supportsAudioRecordingMp3 = (source: string) => {
  if (source === 'twilio.whatsapp') source = 'twilioWhatsapp';

  const audioFiles = attachmentsExtensions[source + 'AudioExtensions'];

  if (!audioFiles || !audioFiles.includes('mp3')) return false;

  return true;
};
