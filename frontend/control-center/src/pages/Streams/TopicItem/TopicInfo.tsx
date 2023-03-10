import React from 'react';
import styles from './index.module.scss';

type TopicInfoProps = {
  topicName: string;
  isExpanded: boolean;
};

const TopicInfo = (props: TopicInfoProps) => {
  const {topicName, isExpanded} = props;

  return (
    <div className={`${styles.container} ${!isExpanded ? styles.expandedContainer : ''}`}>
      <div className={styles.name}>
        <div className={styles.blankSpace} />
        <p className={`${styles.componentName}`}>{topicName}</p>
      </div>
    </div>
  );
};

export default TopicInfo;
