import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
// @ts-ignore
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {ReactComponent as Smiley} from 'assets/images/icons/smiley.svg';
import {ReactComponent as TemplateAlt} from 'assets/images/icons/templateAlt.svg';
import {ReactComponent as Paperclip} from 'assets/images/icons/paperclip.svg';
import {ReactComponent as MicrophoneOutline} from 'assets/images/icons/microphoneOutline.svg';
import {ReactComponent as MicrophoneFilled} from 'assets/images/icons/microphoneFilled.svg';
import TemplateSelector from '../TemplateSelector';
import {Template, Source} from 'model';
import {ErrorPopUp} from 'components';
import {getInputAcceptedFilesForSource, supportsAudioRecordingMp3} from '../../../services/types/attachmentsTypes';
import styles from './InputOptions.module.scss';
import {useTranslation} from 'react-i18next';
import {ListenOutsideClick} from 'components';


type Props = {
  source: Source;
  inputDisabled: boolean;
  input: string;
  setInput: (input: string) => void;
  selectTemplate: (template: Template) => void;
  focusInput: () => void;
  selectFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFileLoaded: boolean;
  closeFileErrorPopUp: () => void;
  errorPopUp: string;
  canSendMedia: boolean;
  loadingSelector: boolean;
  audioRecordingStarted: boolean;
  startAudioRecording: () => void;
  audioRecordingPreviewLoading: boolean;
  resumeVoiceRecording: () => void;
  audioRecordingResumed: boolean;
  audioRecordingPaused: boolean;
  isAudioRecordingPaused: (status: boolean) => void;
  audioRecordingCanceled?: boolean;
};

export const InputOptions = (props: Props) => {
  const {
    source,
    inputDisabled,
    input,
    setInput,
    selectTemplate,
    focusInput,
    selectFile,
    isFileLoaded,
    errorPopUp,
    canSendMedia,
    closeFileErrorPopUp,
    loadingSelector,
    audioRecordingStarted,
    startAudioRecording,
    audioRecordingPreviewLoading,
    resumeVoiceRecording,
    audioRecordingResumed,
    audioRecordingPaused,
    isAudioRecordingPaused,
    audioRecordingCanceled,
  } = props;
  const {t} = useTranslation();

  const [isShowingEmojiDrawer, setIsShowingEmojiDrawer] = useState(false);
  const [isShowingTemplateModal, setIsShowingTemplateModal] = useState(false);
  const [isShowingFileSelector, setIsShowingFileSelector] = useState(false);
  const [inputAcceptedFiles, setInputAcceptedFiles] = useState<null | string>('');
  const [inputFile, setInputFile] = useState<React.InputHTMLAttributes<HTMLInputElement>>(undefined);
  const inputFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inputAcceptFilesValue = getInputAcceptedFilesForSource(source);
    setInputAcceptedFiles(inputAcceptFilesValue);
  }, [source]);

  useEffect(() => {
    if (!isFileLoaded) {
      setInputFile(null);
      if (inputFileRef && inputFileRef.current) {
        inputFileRef.current.value = null;
      }
    }
  }, [isFileLoaded]);

  const onInputFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    setInputFile(file);
    selectFile(event);
  };

  const toggleEmojiDrawer = () => {
    if (isShowingTemplateModal || isShowingFileSelector) {
      setIsShowingTemplateModal(false);
      setIsShowingFileSelector(false);
    }
    if (isShowingEmojiDrawer) {
      focusInput();
    }

    setIsShowingEmojiDrawer(true);
  };

  const toggleTemplateModal = () => {
    if (isShowingEmojiDrawer || isShowingFileSelector) {
      setIsShowingEmojiDrawer(false);
      setIsShowingFileSelector(false);
    }
    setIsShowingTemplateModal(!isShowingTemplateModal);
  };

  const toggleFileSelector = () => {
    if (isShowingEmojiDrawer || isShowingTemplateModal) {
      setIsShowingEmojiDrawer(false);
      setIsShowingFileSelector(false);
    }
    setIsShowingFileSelector(!isShowingFileSelector);
  };

  const addEmoji = emoji => {
    setInput(`${input} ${emoji.native}`);
  };

  const handleMicrophoneIconClick = () => {
    if (!audioRecordingCanceled) {
      resumeVoiceRecording();
      isAudioRecordingPaused(false);
    } else {
      startAudioRecording();
    }
  };

  return (
    <div className={`${styles.container} ${audioRecordingCanceled ? styles.alignBottom : styles.alignCenter}`}>
      {errorPopUp && (
        <div className={styles.fileSizeErrorPopUp}>
          <ErrorPopUp message={errorPopUp} closeHandler={closeFileErrorPopUp} />
        </div>
      )}

      {isShowingTemplateModal && (
        <TemplateSelector
          onClose={toggleTemplateModal}
          selectTemplate={template => {
            setIsShowingTemplateModal(false);
            selectTemplate(template);
          }}
          source={source}
        />
      )}
      {isShowingEmojiDrawer && (
        <ListenOutsideClick onOuterClick={() => setIsShowingEmojiDrawer(false)} className={styles.emojiDrawer}>
          <Picker data={data} theme={localStorage.getItem('theme')} previewPosition={"none"} onEmojiSelect={addEmoji} />
        </ListenOutsideClick>
      )}

      {audioRecordingCanceled && (
        <>
          <button
            className={`${styles.iconButton} ${styles.templateButton} ${isShowingEmojiDrawer ? styles.active : ''}`}
            type="button"
            disabled={inputDisabled || !!errorPopUp || loadingSelector}
            onClick={toggleEmojiDrawer}
          >
            <div className={styles.actionToolTip}>Emojis</div>
            <Smiley aria-hidden className={styles.smileyIcon} />
          </button>
          <button
            className={`${styles.iconButton} ${styles.templateButton} ${isShowingTemplateModal ? styles.active : ''}`}
            type="button"
            disabled={inputDisabled || !!errorPopUp || loadingSelector}
            onClick={toggleTemplateModal}
          >
            <div className={styles.actionToolTip}>{t('templates')}</div>
            <div className={styles.templateActionContainer}>
              <TemplateAlt aria-hidden className={styles.templateAltIcon} />
            </div>
          </button>
        </>
      )}

      {canSendMedia &&
        (source === 'facebook' ||
          source === 'instagram' ||
          source === 'google' ||
          source === 'twilio.whatsapp' ||
          source === 'chatplugin') && (
          <>
            {audioRecordingCanceled && (
              <button
                className={`${styles.iconButton} ${styles.templateButton} ${
                  isShowingFileSelector ? styles.active : ''
                }`}
                type="button"
                disabled={inputDisabled || !!errorPopUp || loadingSelector}
                onClick={toggleFileSelector}
              >
                <div className={styles.actionToolTip}>{t('files')}</div>

                <label
                  htmlFor="file"
                  style={{
                    cursor: inputDisabled || !!errorPopUp || loadingSelector ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Paperclip aria-hidden className={styles.paperclipIcon} />
                </label>

                <input
                  type="file"
                  id="file"
                  name="file"
                  ref={inputFileRef}
                  value={inputFile?.value}
                  onChange={onInputFileChangeHandler}
                  className={styles.fileInput}
                  disabled={inputDisabled || !!errorPopUp || loadingSelector}
                  accept={inputAcceptedFiles}
                />
              </button>
            )}

            {supportsAudioRecordingMp3(source) && (
              <button
                className={`${styles.recordingIconButton} ${
                  audioRecordingStarted || audioRecordingResumed
                    ? styles.iconRecordingOn
                    : audioRecordingPaused
                    ? styles.iconRecordingPaused
                    : styles.iconRecordingDefault
                }`}
                type="button"
                disabled={
                  inputDisabled ||
                  !!errorPopUp ||
                  loadingSelector ||
                  audioRecordingStarted ||
                  audioRecordingResumed ||
                  audioRecordingPreviewLoading
                }
                onClick={handleMicrophoneIconClick}
              >
                <div className={styles.actionToolTip}>
                  {audioRecordingPaused && !audioRecordingPreviewLoading
                    ? t('continueRecording')
                    : t('recordAudioClip')}
                </div>
                {audioRecordingPaused ? <MicrophoneFilled aria-hidden /> : <MicrophoneOutline aria-hidden />}
              </button>
            )}
          </>
        )}
    </div>
  );
};
