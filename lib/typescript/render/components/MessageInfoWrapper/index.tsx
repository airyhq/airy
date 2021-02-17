import React, {ReactNode} from 'react';
import {Avatar} from '../Avatar';
import {DefaultMessageRenderingProps} from '../../components/index';
import styles from './index.module.scss';

type AvatarTimeProps = {
  children?: ReactNode;
  lastInGroup: boolean;
} & DefaultMessageRenderingProps;

export const MessageInfoWrapper = (props: AvatarTimeProps) => {
  const {sentAt, contact, fromContact, children, lastInGroup} = props;

  return (
    <>
      {fromContact ? (
        <>
          <div className={styles.contact}>
            {sentAt && (
              <>
                <div className={styles.avatar}>
                  <Avatar contact={contact} />
                </div>
              </>
            )}
            <div style={lastInGroup == false ? {paddingLeft: '40px', marginLeft: '8px'} : {}}>{children}</div>
          </div>
          <div className={styles.time}>{sentAt}</div>
        </>
      ) : (
        <>
          {children}
          <div className={styles.member}>
            <div className={styles.time}>{sentAt}</div>
          </div>
        </>
      )}
    </>
  );
};
