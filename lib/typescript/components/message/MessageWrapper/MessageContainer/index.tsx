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
  const failedMessage = true;

  //deliveryState === DeliveryState.failed;

  return (
    <div className={`${styles.messageContainer} ${isContact ? styles.contactContainer : styles.memberContainer}`}>
      <div className={`${styles.messageContent} ${isContact ? styles.contact : styles.member}`}>
        <div className={`${isContact ? styles.contact : styles.member}`}>
          {!isContact && (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink'}}>
              {decoration && isContact && decoration}
              {failedMessage && !isChatPlugin && (
                <ErrorMessageIcon className={styles.failedMessageIcon} height={24} width={24} />
              )}
            </div>
          )}

          <div className={`${isContact ? styles.contactContent : styles.memberContent}`}>{children}</div>

          {isContact && (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink'}}>
              {decoration && isContact && decoration}
              {failedMessage && !isChatPlugin && (
                <ErrorMessageIcon className={styles.failedMessageIcon} height={24} width={24} />
              )}
            </div>
          )}
        </div>
        {/* //{decoration && isContact && decoration} */}
        {/* {failedMessage && isContact && !isChatPlugin && (
          <ErrorMessageIcon className={styles.failedMessageIcon} height={24} width={24} />
        )} */}
      </div>
      <Reaction messageReaction={'❤️'} isContact={isContact} />
    </div>
  );
};
