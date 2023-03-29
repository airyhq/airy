import React from 'react';
import styles from './index.module.scss';

type TopicInfoProps = {
  topicName: string;
  isExpanded: boolean;
  isJoinSelectionEnabled: boolean;
  selectedTopics: string[];
  isSelected: boolean;
  addTopicsToSelection: (topicName: string) => void;
};

const TopicInfo = (props: TopicInfoProps) => {
  const {topicName, isExpanded, isSelected, isJoinSelectionEnabled, selectedTopics, addTopicsToSelection} = props;

  return (
    <div className={`${styles.container} ${!isExpanded ? styles.expandedContainer : ''}`}>
      {isJoinSelectionEnabled && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={e => {
            e.preventDefault();
            e.stopPropagation();
            addTopicsToSelection(topicName);
          }}
          onClick={e => {
            e.stopPropagation();
          }}
          disabled={selectedTopics.length === 2 && !isSelected}
        />
      )}
      <div className={styles.name}>
        <div className={styles.blankSpace} />
        <p className={`${styles.componentName}`}>{topicName}</p>
      </div>
    </div>
  );
};

export default TopicInfo;
