import React from 'react';
import {Config} from '../../config';
import style from './index.module.scss';
import {ReactComponent as CloseButton} from 'assets/images/icons/close.svg';
import {ReactComponent as MinimizeButton} from 'assets/images/icons/minimizeButton.svg';
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

  const customStyleSubtitle = {
    ...(config?.accentColor && {
      color: config?.accentColor,
    }),
    ...(config?.subtitleTextColor && {
      color: config?.subtitleTextColor,
    }),
  };

  const ClosingOptionMedium = () => {
    return (
      <div className={style.buttonMenu}>
        <button
          className={style.closeButton}
          onClick={props.toggleHideChat}
          title="End chat"
          data-cy={cyChatPluginHeaderBarCloseButton}
        >
          <CloseButton />
        </button>
      </div>
    );
  };

  const ClosingOptionFull = () => {
    return (
      <div className={style.buttonMenu}>
        <button className={style.minimizeButton} onClick={props.toggleHideChat} title="Minimize chat">
          <MinimizeButton />
        </button>
        <button
          className={style.closeButton}
          onClick={showModalOnClick}
          title="End chat"
          data-cy={cyChatPluginHeaderBarCloseButton}
        >
          <CloseButton />
        </button>
      </div>
    );
  };

  const ClosingOption = () => {
    if (config.closeMode) {
      if (config.closeMode === 'basic') {
        return <div />;
      } else if (config.closeMode === 'medium') {
        return <ClosingOptionMedium />;
      }
    }
    return <ClosingOptionFull />;
  };

  return (
    <div className={style.header}>
      <div className={style.headerInfo}>
        <h1 className={style.headerTitle} style={customStyle}>
          {config.headerText || 'Customer Chat'}
        </h1>
        <p className={style.subtitle} style={customStyleSubtitle}>
          {config.subtitleText || (config.showMode === true && 'Customer Subtitle')}
        </p>
      </div>
      <ClosingOption />
    </div>
  );
};

export default AiryHeaderBar;
