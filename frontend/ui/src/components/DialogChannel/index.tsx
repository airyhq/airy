import React, {useState, Fragment} from 'react';

import ListenOutsideClick from '../ListenOutsideClick';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';

interface IProps {
  onClose: () => void;
  closeAfter?: number;
  animate?: boolean;
}

const DialogChannel: React.FunctionComponent<IProps> = ({onClose, animate, children}) => {
  const [dialogVisible, setDialogVisible] = useState(true);

  const closeClicked = event => {
    event.preventDefault();
    setDialogVisible(false);
  };

  return (
    <Fragment
      {...dialogVisible}
      timeout={animate ? 200 : 0}
      classNames={{exit: styles.fadeTransition}}
      onExited={() => {
        onClose();
      }}>
      <div className={styles.background}>
        <div className={styles.dialog}>
          <ListenOutsideClick className={styles.dialogInner} onOuterClick={closeClicked}>
            {children}
          </ListenOutsideClick>
          <button onClick={closeClicked} className={styles.closeButton}>
            <CloseIcon title="Close dialog" />
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default DialogChannel;
