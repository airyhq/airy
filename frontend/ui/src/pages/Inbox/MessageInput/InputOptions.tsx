import React, {useEffect, useRef, useState} from 'react';
import {Picker} from 'emoji-mart';
import {ReactComponent as Smiley} from 'assets/images/icons/smiley.svg';
import {ReactComponent as TemplateAlt} from 'assets/images/icons/template-alt.svg';
import {ReactComponent as Paperclip} from 'assets/images/icons/paperclip.svg';
import {getOutboundMapper} from 'render';
import {FacebookMapper} from 'render/outbound/facebook';
import 'emoji-mart/css/emoji-mart.css';
import TemplateSelector from '../TemplateSelector';
import styles from './InputOptions.module.scss';
import {sendMessages} from '../../../actions/messages';
import {connect, ConnectedProps} from 'react-redux';
import {Template, Source} from 'model';
import {StateModel} from '../../../reducers/index';
import {HttpClientInstance} from '../../../InitializeAiryApi';

const mapDispatchToProps = {sendMessages};

const mapStateToProps = (state: StateModel) => ({
  config: state.data.config,
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = {
  source: Source;
  inputDisabled: boolean;
  input: string;
  setInput: (input: string) => void;
  selectTemplate: (template: Template) => void;
  focusInput: () => void;
  conversationId: string;
} & ConnectedProps<typeof connector>;

export const InputOptions = (props: Props) => {
  const {source, inputDisabled, input, setInput, selectTemplate, focusInput, sendMessages, conversationId, config} =
    props;

  const emojiDiv = useRef<HTMLDivElement>(null);
  const [isShowingEmojiDrawer, setIsShowingEmojiDrawer] = useState(false);
  const [isShowingTemplateModal, setIsShowingTemplateModal] = useState(false);
  const outboundMapper = getOutboundMapper('facebook') as FacebookMapper;

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

  const uploadAndSendFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    HttpClientInstance.uploadFile({file: formData}).then((response: any) => {
      return sendMessages({
        conversationId: conversationId,
        message: outboundMapper.getAttachmentPayload(response.mediaUrl),
      });
    });
  };

  return (
    <div className={styles.container}>
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
        disabled={inputDisabled}
        onClick={toggleEmojiDrawer}>
        <div className={styles.actionToolTip}>Emojis</div>
        <Smiley aria-hidden className={styles.smileyIcon} />
      </button>
      <button
        className={`${styles.iconButton} ${styles.templateButton} ${isShowingTemplateModal ? styles.active : ''}`}
        type="button"
        disabled={inputDisabled}
        onClick={toggleTemplateModal}>
        <div className={styles.actionToolTip}>Templates</div>
        <div className={styles.templateActionContainer}>
          <TemplateAlt aria-hidden className={styles.templateAltIcon} />
        </div>
      </button>

      {config?.components['media-resolver'].enabled && (
        <button className={`${styles.iconButton}`} type="button" disabled={inputDisabled}>
          <div className={styles.actionToolTip}>Files</div>

          <label htmlFor="file" className={styles.filesLabel}>
            <Paperclip aria-hidden className={styles.paperclipIcon} />
          </label>

          <input type="file" id="file" name="file" onChange={uploadAndSendFile} className={styles.fileInput} />
        </button>
      )}
    </div>
  );
};
