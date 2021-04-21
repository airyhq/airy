import React from 'react';
import {Config} from '../../config';
import style from './index.module.scss';
import {ReactComponent as CloseButton} from 'assets/images/icons/close.svg';
import {ReactComponent as MinimizeButton} from 'assets/images/icons/minimize-button.svg';
import {cyChatPluginHeaderBarCloseButton} from 'chat-plugin-handles';

type AiryHeaderBarProps = {
  toggleHideChat: () => void;
  config?: Config;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AiryHeaderBar = (props: AiryHeaderBarProps) => {
  const showModalOnClick = () => props.setShowModal(true);
  const {config} = props;

  const customStyle = {
    ...(config?.accentColor && {
      color: config?.accentColor,
    }),
    ...(config?.headerTextColor && {
      color: config?.headerTextColor,
    }),
  };

  return (
    <div className={style.header}>
      <div className={style.headerInfo}>
        <h1 className={style.headerTitle} style={customStyle}>
          {config.headerText || 'Customer Chat'}
        </h1>
      </div>

      <button className={style.minimizeButton} onClick={props.toggleHideChat} title="Minimize chat">
        <MinimizeButton />
      </button>

      <button
        className={style.closeButton}
        onClick={showModalOnClick}
        title="End chat"
        data-cy={cyChatPluginHeaderBarCloseButton}>
        <CloseButton />
      </button>
    </div>
  );
};

export default AiryHeaderBar;
