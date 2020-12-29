import React from 'react';

import styles from './index.module.scss';

const ConversationListHeader: React.FC = (): JSX.Element => {
  return <div className={styles.headline}>Inbox</div>;
};

export default ConversationListHeader;
