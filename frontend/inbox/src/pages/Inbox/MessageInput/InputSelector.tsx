import React, {useRef, useEffect, useState} from 'react';
import styles from './InputSelector.module.scss';
import {ReactComponent as Close} from 'assets/images/icons/close.svg';
import {SourceMessage} from 'render';
import {Source, Message} from 'model';

type InputSelectorProps = {
  messageType: 'template' | 'suggestedReplies' | 'message';
  message: Message;
  source: Source;
  removeElementFromInput: () => void;
  contentResizedHeight: number;
};

const textareaHeight = 40;
const minImageHeight = 50;

export const InputSelector = (props: InputSelectorProps) => {
  const {source, message, messageType, removeElementFromInput, contentResizedHeight} = props;
  const [closeIconWidth, setCloseIconWidth] = useState('');
  const [closeIconHeight, setCloseIconHeight] = useState('');
  const [selectorPreviewCloseButton, setSelectorPreviewCloseButton] = useState(false);
  let iconSize = '18px';
  let buttonSize = '36px';

  const fileSelectorDiv = useRef(null);
  const removeFileButton = useRef(null);

  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const fileSelectorHeight = entry.contentRect.height;
      const fileSelectorWidth = entry.contentRect.width;

      if (fileSelectorHeight > contentResizedHeight) {
        scaleDownInputSelector(fileSelectorHeight);
      } else if (fileSelectorHeight >= textareaHeight && fileSelectorWidth > minImageHeight) {
        setSelectorPreviewCloseButton(true);
      }
    }
  });

  useEffect(() => {
    resizeObserver.observe(fileSelectorDiv?.current);
  }, [fileSelectorDiv?.current]);

  const scaleDownInputSelector = (fileSelectorHeight: number) => {
    const scaleRatio = Number(Math.min(contentResizedHeight / fileSelectorHeight).toFixed(2));

    if (scaleRatio <= 0.9) {
      if (scaleRatio < 0.5) {
        iconSize = scaleRatio > 0.3 ? '24px' : '36px';
        buttonSize = scaleRatio > 0.3 ? '56px' : '72px';

        if (messageType == 'template') {
          iconSize = '48px';
          buttonSize = '116px';
        }
      } else {
        iconSize = '18px';
        buttonSize = '36px';
      }

      setCloseIconHeight(iconSize);
      setCloseIconWidth(iconSize);

      if (removeFileButton && removeFileButton.current) {
        removeFileButton.current.style.width = buttonSize;
        removeFileButton.current.style.height = buttonSize;
      }
    }

    fileSelectorDiv.current.style.transform = `scale(${scaleRatio})`;
    fileSelectorDiv.current.style.transformOrigin = 'left';
    setSelectorPreviewCloseButton(true);
  };

  return (
    <div className={styles.container} ref={fileSelectorDiv}>
      {selectorPreviewCloseButton && (
        <button
          className={styles.removeButton}
          onClick={removeElementFromInput}
          ref={removeFileButton}
          style={{height: iconSize, width: iconSize}}
        >
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
