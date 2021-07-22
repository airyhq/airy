import React, {useEffect, useRef, useState} from 'react';
import {Picker} from 'emoji-mart';
import {ReactComponent as Smiley} from 'assets/images/icons/smiley.svg';
import {ReactComponent as TemplateAlt} from 'assets/images/icons/template-alt.svg';

import TemplateSelector from '../TemplateSelector';
import styles from './InputOptions.module.scss';

export const InputOptions = ({source, inputDisabled, input, setInput, selectTemplate, focus: focusInput}) => {
  const emojiDiv = useRef<HTMLDivElement>(null);
  const [isShowingEmojiDrawer, setIsShowingEmojiDrawer] = useState(false);
  const [isShowingTemplateModal, setIsShowingTemplateModal] = useState(false);

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
    </div>
  );
};
