import React, {useState} from 'react';
import style from './index.module.scss';
import {ReactComponent as CloseButton} from '../../../../assets/images/icons/close-button.svg';
import {ReactComponent as MinimizeButton} from '../../../../assets/images/icons/minimize-button.svg';
import ModalDialogue from '../../components/modal';

type AiryHeaderBarProps = {
  toggleHideChat: () => void;
};

const AiryHeaderBar = (props: AiryHeaderBarProps) => {
  const [showModal, setShowModal] = useState(false);

  const closeModalOnClick = () => setShowModal(false);

  const disconnectChat = () => {
    closeModalOnClick();
  };

  return (
    <>
      <div className={style.header}>
        <div className={style.headerInfo}>
          <h1 className={style.headerTitle}>Customer Chat</h1>
        </div>

        <button className={style.minimizeButton} onClick={() => props.toggleHideChat()} title="Minimize chat">
          <MinimizeButton />
        </button>

        <button className={style.closeButton} onClick={() => setShowModal(true)} title="End chat">
          <CloseButton />
        </button>
      </div>

      {showModal && (
        <ModalDialogue close={closeModalOnClick}>
          <>
            <div className={style.buttonWrapper}>
              <button className={style.cancelButton} onClick={closeModalOnClick}>
                {' '}
                Cancel
              </button>
              <button className={style.endChatButton} onClick={disconnectChat}>
                {' '}
                End Chat
              </button>
            </div>
          </>
        </ModalDialogue>
      )}
    </>
  );
};

export default AiryHeaderBar;
