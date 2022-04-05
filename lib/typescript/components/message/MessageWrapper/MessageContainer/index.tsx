import React from 'react';
import {SourceMessage} from 'render';
import {DeliveryState, Source} from 'model';
import {MessageContent} from './MessageContent';
import {Reaction} from '../../Reaction';
import {ReactComponent as ErrorMessageIcon} from 'assets/images/icons/errorMessage.svg';
import styles from './index.module.scss';

interface MessageContainerProps {
  message: any;
  source: Source;
  isContact: boolean;
  messageDecoration?: any;
  isChatPlugin: boolean;
  contentType: 'message' | 'template' | 'suggestedReplies' | 'quickReplies';
  invertSides?: any;
  commandCallback?: any;
}

export const MessageContainer = (props: MessageContainerProps) => {
  const {message, source, isContact, messageDecoration, isChatPlugin, contentType, invertSides, commandCallback} =
    props;
  const chatPluginProps = isChatPlugin ? {invertSides: invertSides, commandCallback: commandCallback} : {};

  return (
    <div className={styles.messageReactionErrorContainer}>
      <div className={styles.messageError}>
        <MessageContent fromContact={message.fromContact} isChatPlugin={isChatPlugin} decoration={messageDecoration}>
          <SourceMessage
            source={source}
            message={message}
            contentType={contentType ?? 'message'}
            {...chatPluginProps}
          />
        </MessageContent>
        {message.deliveryState === DeliveryState.failed && isContact && (
          <ErrorMessageIcon className={styles.failedMessageIcon} height={24} width={24} />
        )}
      </div>
      <Reaction message={message} isContact={isContact} />
    </div>
  );
};
