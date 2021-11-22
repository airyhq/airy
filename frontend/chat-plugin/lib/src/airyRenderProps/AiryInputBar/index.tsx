import React, {ChangeEvent, FormEvent, KeyboardEvent, createRef, useEffect, useState, useRef} from 'react';
import {cyInputbarTextarea, cyInputbarButton} from 'chat-plugin-handles';
import {EmojiPickerWrapper} from '../../components/emojiPicker/EmojiPickerWrapper';
import {Config} from '../../config';
import {useTranslation} from 'react-i18next';
import {ReactComponent as AiryIcon} from 'assets/images/icons/airy-icon.svg';
import style from './index.module.scss';
import {ReactComponent as Smiley} from 'assets/images/icons/smiley.svg';
import {ReactComponent as PaperClip} from 'assets/images/icons/paperclipChatplugin.svg';
import {ReactComponent as Paperplane} from 'assets/images/icons/paperplane.svg';
import {getAttachmentType, getOutboundMapper} from 'render';
import {InputSelector} from './InputSelector';
import {uploadMedia} from '../../api';
import {SimpleLoader} from 'components';

type AiryInputBarProps = {
  sendMessage: (text: string) => void;
  sendMedia: (fileType: string, mediaUrl: string) => void;
  messageString: string;
  setMessageString: (text: string) => void;
  config?: Config;
  setNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  dragDropFile: File;
};

const AiryInputBar = (props: AiryInputBarProps) => {
  const {config} = props;

  const {t} = useTranslation();
  const [isShowingEmojiDrawer, setIsShowingEmojiDrawer] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const emojiDiv = useRef(null);
  const fileRef = useRef(null);
  const outboundMapper: any = getOutboundMapper('chatplugin');
  const contentResizedHeight = 100;

  const textInputRef = createRef<HTMLTextAreaElement>();
  const dataCyButtonId = cyInputbarButton;
  const dataCyTextareaId = cyInputbarTextarea;
  const isMobileDevice = window.innerHeight < 1200 || window.innerWidth < 1000;

  useEffect(() => {
    textInputRef.current.selectionStart = props.messageString?.length ?? 0;
    textInputRef.current.selectionEnd = props.messageString?.length ?? 0;
  }, []);

  useEffect(() => {
    props.dragDropFile && uploadFile(props.dragDropFile);
  }, [props.dragDropFile]);

  const resizeTextarea = () => {
    const textArea = textInputRef.current;
    if (textArea) {
      const outerHeight = parseInt(window.getComputedStyle(textArea).height, 10);
      const diff = outerHeight - textArea.clientHeight;
      // Set this to 0 first to get the calculation correct. Sadly this is needed.
      textArea.style.height = '0';
      textArea.style.height = Math.min(128, textArea.scrollHeight + diff) + 'px';
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (props.messageString.length) {
      props.setMessageString('');
      props.sendMessage(props.messageString);
    }

    if (uploadedFileUrl) {
      props.sendMedia(mediaType, uploadedFileUrl);
      setUploadedFileUrl(null);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    resizeTextarea();
    props.setMessageString(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    resizeTextarea();
    if (event.key === 'Enter') {
      const localValue = event.currentTarget.value;
      if (localValue.length) {
        event.preventDefault();
        props.setMessageString('');
        props.sendMessage(localValue);
      }
    }
  };

  const removeElementFromInput = () => {
    setUploadedFileUrl(null);
  };

  const uploadFile = (file: File) => {
    const fileType = getAttachmentType(file.name, 'chatplugin');
    setMediaType(fileType);
    setLoadingFile(true);
    uploadMedia(file).then((mediaUrl: string) => {
      setUploadedFileUrl(mediaUrl);
      props.setMessageString('');
      setLoadingFile(false);
    });
  };

  const EmojiInput = () => {
    const handleEmojiDrawer = () => {
      if (isShowingEmojiDrawer) {
        textInputRef.current && textInputRef.current.focus();
      }

      setIsShowingEmojiDrawer(!isShowingEmojiDrawer);
    };

    const handleEmojiKeyEvent = e => {
      if (e.key === 'Escape') {
        handleEmojiDrawer();
      }
    };

    const handleEmojiClickedOutside = e => {
      if (emojiDiv.current === null || emojiDiv.current.contains(e.target)) {
        return;
      }

      handleEmojiDrawer();
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

    const addEmoji = emoji => {
      const emojiMessage = emoji.native;

      const message = props.messageString + ' ' + emojiMessage;

      props.setMessageString(message);

      handleEmojiDrawer();
    };

    return (
      <div>
        {isShowingEmojiDrawer && (
          <div ref={emojiDiv} className={style.emojiDrawer}>
            <EmojiPickerWrapper addEmoji={addEmoji} />
          </div>
        )}
        {!uploadedFileUrl && (
          <button className={style.iconButton} type="button" onClick={handleEmojiDrawer}>
            <div className={style.actionToolTip}>Emojis</div>
            <Smiley aria-hidden className={style.smileyIcon} />
          </button>
        )}
      </div>
    );
  };

  const AttachmentInput = () => {
    const openFileSelector = () => {
      fileRef.current.click();
    };

    const selectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (uploadedFileUrl) setUploadedFileUrl(null);
      const file = event.target.files[0];
      uploadFile(file);
    };

    return (
      <>
        {!uploadedFileUrl && (
          <>
            <button className={style.iconButton} type="button" onClick={openFileSelector}>
              <div className={style.actionToolTip}>Files</div>
              <PaperClip aria-hidden className={style.paperclipIcon} />
            </button>

            <input
              ref={fileRef}
              type="file"
              id="file"
              name="file"
              onChange={selectedFile}
              className={style.fileInput}
              accept=".jpeg, .jpg, .gif, .png, .webp, .heic, .svg, .pdf"
            />
          </>
        )}
      </>
    );
  };

  return (
    <>
      {!(config.hideInputBar === true) && (
        <form
          className={style.inputBar}
          style={uploadedFileUrl ? {justifyContent: 'space-between'} : {justifyContent: 'flex-end'}}
          onSubmit={onSubmit}>
          {loadingFile ? (
            <div className={style.selectorLoader}>
              <SimpleLoader />
              <span>loading file... </span>
            </div>
          ) : (
            <>
              {uploadedFileUrl ? (
                <InputSelector
                  message={outboundMapper?.getAttachmentPayload(uploadedFileUrl)}
                  removeElementFromInput={removeElementFromInput}
                  contentResizedHeight={contentResizedHeight}
                />
              ) : (
                <textarea
                  ref={textInputRef}
                  className={style.textArea}
                  placeholder={t('sendMessageInputPlaceholder')}
                  autoFocus={isMobileDevice ? false : !config.showMode}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  value={props.messageString}
                  data-cy={dataCyTextareaId}
                />
              )}
            </>
          )}

          <div className={style.buttonContainer}>
            {!(config.hideEmojis === true) && <EmojiInput />}
            {!(config.hideAttachments === true) && <AttachmentInput />}
            <button className={style.sendButton} type="submit" data-cy={dataCyButtonId}>
              {config?.sendMessageIcon ? <img src={config.sendMessageIcon} alt={'send message'} /> : <Paperplane />}
            </button>
          </div>
        </form>
      )}
      <div className={style.poweredByContainer}>
        <a
          href="https://airy.co/?utm_source=airy&utm_medium=chat&utm_campaign=chat-plugin-demo"
          target="_blank"
          rel="noreferrer">
          Powered by Airy <AiryIcon />
        </a>
      </div>
    </>
  );
};

export default AiryInputBar;
