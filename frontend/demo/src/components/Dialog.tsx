import React, {Fragment, useEffect, useCallback} from 'react';

import styles from './Dialog.module.scss';

type DialogProps = {
  children: React.ReactNode;
  /** Additional style paramaters, for example top/bottom/left/right for positioning of the dialog */
  style?: React.CSSProperties;
  /** Additional style for the full background, ideal to dim the rest of the page while the dialog is shown */
  coverStyle?: React.CSSProperties;
  /** Should the dialog be an overlay or a normal div? defaults to true,
   * meaning: overlay. */
  overlay?: boolean;
  close: (event: React.MouseEvent<HTMLElement>) => void;
};

const Dialog = ({children, close, style, coverStyle, overlay}: DialogProps) => {
  const keyDown = useCallback(
    e => {
      if (e.key === 'Escape') {
        close(e);
      }
    },
    [close]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyDown);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, [keyDown]);

  return (
    <Fragment>
      <div className={styles.clickCover} onClick={close} style={coverStyle} />
      <div style={style} className={overlay === false ? styles.nonOverlayDialog : styles.dialog}>
        {children}
      </div>
    </Fragment>
  );
};

export default Dialog;
