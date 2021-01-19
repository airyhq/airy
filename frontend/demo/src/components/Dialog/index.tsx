import React, {useState, useEffect} from 'react';

import ListenOutsideClick from '../ListenOutsideClick';
import {ReactComponent as CloseIcon} from '../../assets/images/icons/close.svg';
// import {CSSTransition} from 'react-transition-group';

import styles from './index.module.scss';

interface DialogProps {
  onClose: () => void;
  closeAfter?: number;
  animate?: boolean;
  children?: React.ReactNode;
}

const Dialog = ({onClose, closeAfter, animate, children}: DialogProps) => {
  const [dialogVisible, setDialogVisible] = useState(true);
  const [closeAfterTimer, setCloseAfterTimer] = useState(null);

  const closeClicked = e => {
    e.preventDefault();
    setDialogVisible(false);
  };

  useEffect(() => {
    clearTimeout(closeAfterTimer);
    if (!!closeAfter && closeAfter > 0) {
      setCloseAfterTimer(
        setTimeout(() => {
          setDialogVisible(false);
        }, closeAfter)
      );
    }
  }, [closeAfter]);

  return (
    // <CSSTransition
    //   in={dialogVisible}
    //   timeout={animate ? 200 : 0}
    //   classNames={{exit: styles.fadeTransition}}
    //   onExited={() => onClose()}>
      <div className={styles.background}>
        <div className={styles.dialog}>
          <ListenOutsideClick className={styles.dialogInner} onOuterClick={closeClicked}>
            {children}
          </ListenOutsideClick>
          D
          <button onClick={closeClicked} className={styles.closeButton}>
            <CloseIcon title="Close dialog" />
          </button>
        </div>
      </div>
    // </CSSTransition>
  );
};

export default Dialog;
