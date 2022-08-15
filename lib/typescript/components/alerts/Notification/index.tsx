import {NotificationModel} from 'model';
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import styles from './index.module.scss';

enum NotificationType {
  fade = 'fade',
  sticky = 'sticky',
}

type NotificationProps = {
  type?: 'fade' | 'sticky';
  show: boolean;
  successful?: boolean;
  info?: boolean;
  text: string;
  setShowFalse: Dispatch<SetStateAction<NotificationModel>>;
  duration?: number; //in ms
};

export const NotificationComponent = (props: NotificationProps) => {
  const {type, show, successful, info, text, setShowFalse, duration} = props;
  const defaultDuration = 5000;
  const [close, setClose] = useState(false);
  const [usedDuration, setUsedDuration] = useState(duration || defaultDuration);
  const [notificationContainerWidth, setNotificationContainerWidth] = useState(240);
  const animType = type || NotificationType.fade;
  const notificationRef = useRef(null);

  setTimeout(() => {
    animType === NotificationType.fade && setShowFalse({show: false});
  }, duration || defaultDuration);

  useEffect(() => {
    setNotificationContainerWidth(notificationRef.current.offsetWidth);
    if (duration) {
      if (animType === NotificationType.fade) {
        setUsedDuration(duration);
      } else {
        setUsedDuration(duration / 2);
      }
    } else {
      if (animType === NotificationType.fade) {
        setUsedDuration(defaultDuration);
      } else {
        setUsedDuration(defaultDuration / 2);
      }
    }
  }, []);

  useEffect(() => {
    close &&
      setTimeout(() => {
        setShowFalse({show: false});
        setClose(false);
      }, duration / 2 || defaultDuration / 2);
  }, [close]);

  return (
    <div
      ref={notificationRef}
      className={`${styles.notificationContainer} ${
        show && animType === NotificationType.fade ? styles.translateYAnimFade : styles.translateYAnimSticky
      } ${close && styles.translateYAnimStickyClose}`}
      style={{
        background: successful === undefined || info ? '#1578d4' : successful ? '#0da36b' : '#d51548',
        animationDuration: `${usedDuration}ms`,
        marginLeft: -(notificationContainerWidth / 2),
      }}
    >
      <div className={styles.contentContainer}>
        <span className={styles.notificationText}>{text}</span>
        {type === NotificationType.sticky && (
          <div className={styles.stickyCloseButton} onClick={() => setClose(true)}>
            <CloseIcon height={12} width={12} color="#FFFFFF" />
          </div>
        )}
      </div>
    </div>
  );
};
