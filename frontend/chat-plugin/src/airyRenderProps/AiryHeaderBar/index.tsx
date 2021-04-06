import React from 'react';
import style from './index.module.scss';
import {ReactComponent as CloseButton} from '../../../../assets/images/icons/close-button.svg';
import {ReactComponent as MinimizeButton} from '../../../../assets/images/icons/minimize-button.svg';

type AiryHeaderBarProps = {
  toggleHideChat: () => void;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AiryHeaderBar = (props: AiryHeaderBarProps) => {
  return (
    <>
      <div className={style.header}>
        <div className={style.headerInfo}>
          <h1 className={style.headerTitle}>Customer Chat</h1>
        </div>

        <button className={style.minimizeButton} onClick={() => props.toggleHideChat()} title="Minimize chat">
          <MinimizeButton />
        </button>

        <button className={style.closeButton} onClick={() => props.setShowModal(true)} title="End chat">
          <CloseButton />
        </button>
      </div>
    </>
  );
};

export default AiryHeaderBar;
