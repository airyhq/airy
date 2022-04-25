import {attachmentsExtensions} from 'render';
import {Source} from 'model';

const getAttachmentFiles = (source: string) => {
  const formattedSource = source as Source;

  const image = attachmentsExtensions[formattedSource + 'ImageExtensions'];
  const video = attachmentsExtensions[formattedSource + 'VideoExtensions'];
  const audio = attachmentsExtensions[formattedSource + 'AudioExtensions'];
  const docs = attachmentsExtensions[formattedSource + 'FileExtensions'];

  return {imageFiles: image, videoFiles: video, audioFiles: audio, docsFiles: docs};
};

export const getAllSupportedAttachmentsForSource = (source: string) => {
  const files = getAttachmentFiles(source);
  const {imageFiles, videoFiles, audioFiles, docsFiles} = files;

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
  const files = getAttachmentFiles(source);
  const {imageFiles, videoFiles, audioFiles, docsFiles} = files;

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
  const files = getAttachmentFiles(source);
  const {audioFiles} = files;

  return audioFiles && audioFiles.includes('mp3');
};
