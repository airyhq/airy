import React, {useRef, useEffect, useState} from 'react';
import styles from './InputSelector.module.scss';
import {ReactComponent as Close} from 'assets/images/icons/close.svg';
import {SourceMessage} from 'render';
import {Source, Message} from 'model';
import {FileInfo} from './index';

type InputSelectorProps = {
  messageType: 'template' | 'suggestedReplies' | 'message';
  message: Message;
  source: Source;
  contentResizedHeight: number;
  fileInfo: FileInfo | null;
  removeElementFromInput: () => void;
};

export const InputSelector = (props: InputSelectorProps) => {
  const {source, message, messageType, removeElementFromInput, contentResizedHeight, fileInfo} = props;
  const [closeIconWidth, setCloseIconWidth] = useState('');
  const [closeIconHeight, setCloseIconHeight] = useState('');
  const [closeButtonSelector, setCloseButtonSelector] = useState(false);

  const fileSelectorDiv = useRef(null);
  const removeFileButton = useRef(null);

  const scaleInputSelector = () => {
    if (fileSelectorDiv?.current?.offsetHeight > contentResizedHeight) {
      const contentSelectorDivHeight = fileSelectorDiv.current.offsetHeight;
      const scaleRatio = Number(Math.min(contentResizedHeight / contentSelectorDivHeight).toFixed(2));

      if (scaleRatio <= 0.9) {
        const iconSize = scaleRatio > 0.3 ? '18px' : '30px';
        const buttonSize = scaleRatio > 0.3 ? '36px' : '60px';

        setCloseIconHeight(iconSize);
        setCloseIconWidth(iconSize);
        setCloseButtonSelector(true);

        if (removeFileButton && removeFileButton.current) {
          removeFileButton.current.style.width = buttonSize;
          removeFileButton.current.style.height = buttonSize;
        }
      } else {
        setCloseButtonSelector(true);
      }

      fileSelectorDiv.current.style.transform = `scale(${scaleRatio})`;
      fileSelectorDiv.current.style.transformOrigin = 'left';
    } else {
      if (fileInfo && fileInfo?.size >= 1 && fileInfo?.type !== 'audio' && fileInfo?.type !== 'file') {
        setTimeout(() => {
          setCloseButtonSelector(true);
        }, 1000);
      } else if (fileInfo && fileInfo?.size < 1 && fileInfo?.type !== 'audio' && fileInfo?.type !== 'file') {
        setTimeout(() => {
          setCloseButtonSelector(true);
        }, 500);
      } else {
        setCloseButtonSelector(true);
      }
    }
  };

  useEffect(() => {
    scaleInputSelector();
  }, []);

  return (
    <div className={styles.container} ref={fileSelectorDiv}>
      {closeButtonSelector && (
        <button className={styles.removeButton} onClick={removeElementFromInput} ref={removeFileButton}>
          <Close
            style={{
              width: closeIconWidth ?? '',
              height: closeIconHeight ?? '',
            }}
          />
        </button>
      )}
      <SourceMessage message={message} source={source} contentType={messageType} />
    </div>
  );
};
