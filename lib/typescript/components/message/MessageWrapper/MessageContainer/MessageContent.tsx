import React, {ReactNode} from 'react';
import {isEqual} from 'lodash-es';
import styles from './index.module.scss';

type MessageContentComponentProps = {
  children: ReactNode;
  isChatPlugin: boolean;
  fromContact?: boolean;
  decoration?: ReactNode;
};

const MessageContentComponent = (props: MessageContentComponentProps) => {
  const {fromContact, children, isChatPlugin, decoration} = props;

  const isContact = isChatPlugin ? !fromContact : fromContact;

  const MemberMessage = () => (
    <div className={styles.member}>
      <div className={styles.memberContent}>{children}</div>
    </div>
  );

  const ContactMessage = () => (
    <>
      <div className={styles.contact}>
        <div className={styles.contactContent}>{children}</div>
        {decoration}
      </div>
    </>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};

const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.messageId === nextProps.messageId) return true;

  return isEqual(prevProps, nextProps);
};

const MessageContent = React.memo(MessageContentComponent, arePropsEqual);

export {MessageContent};
