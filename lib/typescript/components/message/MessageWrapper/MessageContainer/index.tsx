import React, {ReactNode} from 'react';
import {SourceMessage, CommandUnion, ContentType} from 'render';
import {DeliveryState, Source, Message} from 'model';
import {ReactComponent as ErrorMessageIcon} from 'assets/images/icons/errorMessage.svg';
import {Reaction} from '../../Reaction';
import styles from './index.module.scss';

interface MessageContainerProps {
  message: Message;
  source: Source;
  isChatPlugin: boolean;
  contentType: ContentType;
  isContact: boolean;
  decoration: ReactNode;
  invertSides?: any;
  commandCallback?: (command: CommandUnion) => void;
}

export const MessageContainer = (props: MessageContainerProps) => {
  const {isContact, message, source, isChatPlugin, contentType, invertSides, commandCallback, decoration} = props;
  const chatPluginProps = isChatPlugin ? {invertSides: invertSides, commandCallback: commandCallback} : {};

  return (
    <div className={styles.messageContainer}>
      <div className={styles.messageContent}>
        <div className={`${isContact ? styles.contact : styles.member}`}>
          <div className={`${isContact ? styles.contactContent : styles.memberContent}`}>
            <SourceMessage source={source} message={message} contentType={contentType} {...chatPluginProps} />
          </div>
        </div>
        {decoration}
        {message.deliveryState === DeliveryState.failed && isContact && (
          <ErrorMessageIcon className={styles.failedMessageIcon} height={24} width={24} />
        )}
      </div>
      <Reaction message={message} isContact={isContact} />
    </div>
  );
};
