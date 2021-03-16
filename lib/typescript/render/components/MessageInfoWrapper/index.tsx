import React, {ReactNode} from 'react';
import {Avatar} from '../Avatar';
import {Contact} from 'httpclient';
import {DefaultMessageRenderingProps} from '../../components/index';
import styles from './index.module.scss';

type MessageInfoWrapperProps = {
  children: ReactNode;
  lastInGroup?: boolean;
  isChatPlugin: boolean;
  contact?: Contact;
  sentAt?: string;
} & DefaultMessageRenderingProps;

export const MessageInfoWrapper = (props: MessageInfoWrapperProps) => {
  const {sentAt, contact, fromContact, children, lastInGroup, isChatPlugin} = props;

  const isContact = isChatPlugin ? !fromContact : fromContact;

  const MemberMessage = () => (
    <div className={styles.member}>
      <div className={styles.memberContent}>{children}</div>
      <div className={styles.time}>{sentAt}</div>
    </div>
  );

  const ContactMessage = () => (
    <>
      <div className={styles.contact}>
        {sentAt && (
          <div className={styles.avatar}>
            <Avatar contact={contact} />
          </div>
        )}
        <div className={styles.contactContent} style={lastInGroup == false ? {marginLeft: '48px'} : {}}>
          {children}
        </div>
      </div>
      <div className={styles.time}>{sentAt}</div>
    </>
  );

  return <>{isContact ? <ContactMessage /> : <MemberMessage />}</>;
};
