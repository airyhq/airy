import React from 'react';
import styles from './index.module.scss';

const NoConversations: React.FC = (): JSX.Element => {
  return Object.keys({}).length === 0 ? (
    <div className={styles.component}>
      <strong>Your new messages will appear here</strong>
      <p>
        We start showing messages from the moment you connect a channel. Your conversations will appear here as soon as
        your contacts message you.
      </p>
    </div>
  ) : (
    <div className={styles.component}>
      <strong>Nothing found</strong>
      <p>We could not find a conversation matching your criterias.</p>
    </div>
  );
};

export default NoConversations;
