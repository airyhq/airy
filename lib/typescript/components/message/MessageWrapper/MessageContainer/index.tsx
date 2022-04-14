import React, {ReactNode} from 'react';
import {DeliveryState} from 'model';
import {ReactComponent as ErrorMessageIcon} from 'assets/images/icons/errorMessage.svg';
import {Reaction} from '../../Reaction';
import styles from './index.module.scss';

interface MessageContainerProps {
  deliveryState: DeliveryState;
  isContact: boolean;
  decoration: ReactNode;
  children: ReactNode;
  isChatPlugin: boolean;
  messageReaction: string;
}

export const MessageContainer = (props: MessageContainerProps) => {
  const {messageReaction, isContact, deliveryState, decoration, children, isChatPlugin} = props;
  const failedMessage = deliveryState === DeliveryState.failed;

  const Notice = () => {
    return (
      <div className={styles.notice}>
        {decoration && isContact && decoration}
        {failedMessage && !isChatPlugin && (
          <ErrorMessageIcon className={styles.failedMessageIcon} height={24} width={24} />
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.messageContainer} ${isContact ? styles.contactContainer : styles.memberContainer}`}>
      <div className={`${styles.messageContent} ${isContact ? styles.contact : styles.member}`}>
        {!isContact && <Notice />}

        {children}

        {isContact && <Notice />}
      </div>
      <Reaction messageReaction={messageReaction} isContact={isContact} />
    </div>
  );
};
