import React, {useState, useEffect, Fragment} from 'react';
import ListenOutsideClick from '../ListenOutsideClick';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';

interface IProps {
  onClose: () => void;
  closeAfter?: number;
  animate?: boolean;
}

const Dialog: React.FunctionComponent<IProps> = ({onClose, closeAfter, animate, children}) => {
  const [dialogVisible, setDialogVisible] = useState(true);
  const [closeAfterTimer, setCloseAfterTimer] = useState(null);

  const closeClicked = event => {
    event.preventDefault();
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
    <Fragment>
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

export default Dialog;

// import React, {Fragment, useEffect, useCallback} from 'react';

// import styles from './index.module.scss';

// type DialogProps = {
//   children: React.ReactNode;
//   /** Additional style paramaters, for example top/bottom/left/right for positioning of the dialog */
//   style?: React.CSSProperties;
//   /** Additional style for the full background, ideal to dim the rest of the page while the dialog is shown */
//   coverStyle?: React.CSSProperties;
//   /** Should the dialog be an overlay or a normal div? defaults to true,
//    * meaning: overlay. */
//   overlay?: boolean;
//   close: () => void;
// };

// const Dialog: React.FC<DialogProps> = ({children, close, style, coverStyle, overlay}: DialogProps): JSX.Element => {
//   const keyDown = useCallback(
//     (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         close();
//       }
//     },
//     [close]
//   );

//   useEffect(() => {
//     document.addEventListener('keydown', keyDown);

//     return () => {
//       document.removeEventListener('keydown', keyDown);
//     };
//   }, [keyDown]);

//   return (
//     <Fragment>
//       <div className={styles.clickCover} onClick={close} style={coverStyle} />
//       <div style={style} className={overlay === false ? styles.nonOverlayDialog : styles.dialog}>
//         {children}
//       </div>
//     </Fragment>
//   );
// };

// export default Dialog;
