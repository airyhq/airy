import React, {MutableRefObject, useEffect, useLayoutEffect} from 'react';
import styles from './index.module.scss';

type TopicInfoProps = {
  topicName: string;
  isJoinSelectionEnabled: boolean;
  selectedTopics: string[];
  isSelected: boolean;
  addTopicsToSelection: (topicName: string) => void;
  toggleExpanded: (item: string) => void;
  itemSelected: string;
};

const TopicInfo = (props: TopicInfoProps) => {
  const {
    topicName,
    isSelected,
    isJoinSelectionEnabled,
    selectedTopics,
    addTopicsToSelection,
    toggleExpanded,
    itemSelected,
  } = props;

  return (
    <div className={`${styles.container} ${itemSelected !== topicName ? styles.expandedContainer : ''}`}>
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
      <div className={styles.info} onClick={() => toggleExpanded(topicName)}>
        <div className={styles.blankSpace} />
        <p className={`${styles.infoComponent}`}>+info</p>
      </div>
    </div>
  );
};

export default TopicInfo;
