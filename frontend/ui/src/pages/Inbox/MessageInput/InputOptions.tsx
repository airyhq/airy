import React, {useEffect, useRef, useState} from 'react';
import {Picker} from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import {ReactComponent as Smiley} from 'assets/images/icons/smiley.svg';
import {ReactComponent as TemplateAlt} from 'assets/images/icons/template-alt.svg';
import {ReactComponent as Paperclip} from 'assets/images/icons/paperclip.svg';
import TemplateSelector from '../TemplateSelector';
import {sendMessages} from '../../../actions/messages';
import {connect, ConnectedProps} from 'react-redux';
import {Template, Source} from 'model';
import {ErrorPopUp} from 'components';
import {getInputAcceptedFilesForSource} from '../../../services/types/attachmentsTypes';
import styles from './InputOptions.module.scss';

const mapDispatchToProps = {sendMessages};

const connector = connect(null, mapDispatchToProps);

interface MediaResolverComponentConfig {
  enabled: boolean;
  healthy: boolean;
}

type Props = {
  source: Source;
  inputDisabled: boolean;
  input: string;
  setInput: (input: string) => void;
  selectTemplate: (template: Template) => void;
  focusInput: () => void;
  selectFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  closeFileErrorPopUp: () => void;
  fileUploadErrorPopUp: string;
  mediaResolverComponentsConfig: MediaResolverComponentConfig;
  loadingSelector: boolean;
} & ConnectedProps<typeof connector>;

export const InputOptions = (props: Props) => {
  const {
    source,
    inputDisabled,
    input,
    setInput,
    selectTemplate,
    focusInput,
    selectFile,
    fileUploadErrorPopUp,
    mediaResolverComponentsConfig,
    closeFileErrorPopUp,
    loadingSelector,
  } = props;

  const emojiDiv = useRef<HTMLDivElement>(null);
  const [isShowingEmojiDrawer, setIsShowingEmojiDrawer] = useState(false);
  const [isShowingTemplateModal, setIsShowingTemplateModal] = useState(false);
  const [inputAcceptedFiles, setInputAcceptedFiles] = useState<null | string>('');

  useEffect(() => {
    console.log('inputAcceptedFiles', inputAcceptedFiles);
  }, [inputAcceptedFiles]);

  useEffect(() => {
    const inputAcceptValue = getInputAcceptedFilesForSource(source);
    setInputAcceptedFiles(inputAcceptValue);
  }, [source]);

  const toggleEmojiDrawer = () => {
    if (isShowingTemplateModal) {
      setIsShowingTemplateModal(false);
    }
    if (isShowingEmojiDrawer) {
      focusInput();
    }

    setIsShowingEmojiDrawer(!isShowingEmojiDrawer);
  };

  const handleEmojiKeyEvent = e => {
    if (e.key === 'Escape') {
      toggleEmojiDrawer();
    }
  };

  const handleEmojiClickedOutside = e => {
    if (emojiDiv.current === null || emojiDiv.current.contains(e.target)) {
      return;
    }

    toggleEmojiDrawer();
  };

  useEffect(() => {
    if (isShowingEmojiDrawer) {
      document.addEventListener('keydown', handleEmojiKeyEvent);
      document.addEventListener('click', handleEmojiClickedOutside);

      return () => {
        document.removeEventListener('keydown', handleEmojiKeyEvent);
        document.removeEventListener('click', handleEmojiClickedOutside);
      };
    }
  }, [isShowingEmojiDrawer]);

  const toggleTemplateModal = () => {
    if (isShowingEmojiDrawer) {
      setIsShowingEmojiDrawer(false);
    }
    setIsShowingTemplateModal(!isShowingTemplateModal);
  };

  const addEmoji = emoji => {
    setInput(`${input} ${emoji.native}`);
    toggleEmojiDrawer();
  };

  return (
    <div className={styles.container}>
      {fileUploadErrorPopUp && (
        <div className={styles.fileSizeErrorPopUp}>
          <ErrorPopUp message={fileUploadErrorPopUp} closeHandler={closeFileErrorPopUp} />
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
        <div ref={emojiDiv} className={styles.emojiDrawer}>
          <Picker showPreview={false} onSelect={addEmoji} title="Emoji" />
        </div>
      )}

      <button
        className={`${styles.iconButton} ${styles.templateButton} ${isShowingEmojiDrawer ? styles.active : ''}`}
        type="button"
        disabled={inputDisabled || loadingSelector}
        onClick={toggleEmojiDrawer}
      >
        <div className={styles.actionToolTip}>Emojis</div>
        <Smiley aria-hidden className={styles.smileyIcon} />
      </button>
      <button
        className={`${styles.iconButton} ${styles.templateButton} ${isShowingTemplateModal ? styles.active : ''}`}
        type="button"
        disabled={inputDisabled || loadingSelector}
        onClick={toggleTemplateModal}
      >
        <div className={styles.actionToolTip}>Templates</div>
        <div className={styles.templateActionContainer}>
          <TemplateAlt aria-hidden className={styles.templateAltIcon} />
        </div>
      </button>

      {mediaResolverComponentsConfig.enabled && (source === 'facebook' || source === 'instagram') && (
        <button
          className={`${styles.iconButton} ${styles.templateButton} ${isShowingTemplateModal ? styles.active : ''}`}
          type="button"
          disabled={inputDisabled || loadingSelector}
        >
          <div className={styles.actionToolTip}>Files</div>

          <label htmlFor="file" style={{cursor: inputDisabled || loadingSelector ? 'not-allowed' : 'pointer'}}>
            <Paperclip aria-hidden className={styles.paperclipIcon} />
          </label>

          <input
            type="file"
            id="file"
            name="file"
            onChange={selectFile}
            className={styles.fileInput}
            disabled={inputDisabled || loadingSelector}
            accept={inputAcceptedFiles}
          />
        </button>
      )}
    </div>
  );
};
