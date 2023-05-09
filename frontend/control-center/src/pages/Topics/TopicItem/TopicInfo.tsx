import React from 'react';
import styles from './index.module.scss';

type TopicInfoProps = {
  topicName: string;
  isExpanded: boolean;
  isJoinSelectionEnabled: boolean;
  selectedTopics: string[];
  isSelected: boolean;
  addTopicsToSelection: (topicName: string) => void;
  toggleExpanded: () => void;
};

const TopicInfo = (props: TopicInfoProps) => {
  const {
    topicName,
    isExpanded,
    isSelected,
    isJoinSelectionEnabled,
    selectedTopics,
    addTopicsToSelection,
    toggleExpanded,
  } = props;

  return (
    <div className={`${styles.container} ${!isExpanded ? styles.expandedContainer : ''}`}>
      {isJoinSelectionEnabled && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            addTopicsToSelection(topicName);
          }}
          disabled={selectedTopics.length === 2 && !isSelected}
        />
      )}
      <div className={styles.name}>
        <div className={styles.blankSpace} />
        <p className={`${styles.componentName}`}>{topicName}</p>
      </div>
      <div className={styles.info} onClick={() => toggleExpanded()}>
        <div className={styles.blankSpace} />
        <p className={`${styles.infoComponent}`}>+info</p>
      </div>
    </div>
  );
};

export default TopicInfo;
