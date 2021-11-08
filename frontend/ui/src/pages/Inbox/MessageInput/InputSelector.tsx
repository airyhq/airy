import React, {useRef, useEffect, useState} from 'react';
import styles from './InputSelector.module.scss';
import {ReactComponent as Close} from 'assets/images/icons/close.svg';
import {SourceMessage} from 'render';
import {Source, Message} from 'model';

type InputSelectorProps = {
  messageType: 'template' | 'suggestedReplies' | 'message';
  message: Message;
  source: Source;
  contentResizedHeight: number;
  removeElementFromInput: () => void;
};

export const InputSelector = (props: InputSelectorProps) => {
  const {source, message, messageType, removeElementFromInput, contentResizedHeight} = props;
  const [closeIconWidth, setCloseIconWidth] = useState('');
  const [closeIconHeight, setCloseIconHeight] = useState('');
  const [selectorPreview, setSelectorPreview] = useState(false);

  const fileSelectorDiv = useRef(null);
  const removeFileButton = useRef(null);

  useEffect(() => {
    scaleInputSelector();
  }, []);

  const scaleInputSelector = () => {
    if (fileSelectorDiv?.current?.offsetHeight > contentResizedHeight) {
      const contentSelectorDivHeight = fileSelectorDiv.current.offsetHeight;
      const scaleRatio = Number(Math.min(contentResizedHeight / contentSelectorDivHeight).toFixed(2));

      if (scaleRatio <= 0.9) {
        const iconSize = scaleRatio > 0.3 ? '18px' : '30px';
        const buttonSize = scaleRatio > 0.3 ? '36px' : '60px';

        setCloseIconHeight(iconSize);
        setCloseIconWidth(iconSize);

        if (removeFileButton && removeFileButton.current) {
          removeFileButton.current.style.width = buttonSize;
          removeFileButton.current.style.height = buttonSize;
        }
      }

      fileSelectorDiv.current.style.transform = `scale(${scaleRatio})`;
      fileSelectorDiv.current.style.transformOrigin = 'left';

      setSelectorPreview(true);
    } else {
      setTimeout(() => {
        setSelectorPreview(true);
      }, 1000);
    }
  };

  return (
    <div className={styles.container} ref={fileSelectorDiv}>
      {selectorPreview && (
        <>
          <button className={styles.removeButton} onClick={removeElementFromInput} ref={removeFileButton}>
            <Close
              style={{
                width: closeIconWidth ?? '',
                height: closeIconHeight ?? '',
              }}
            />
          </button>
          <SourceMessage message={message} source={source} contentType={messageType} />
        </>
      )}
    </div>
  );
};
