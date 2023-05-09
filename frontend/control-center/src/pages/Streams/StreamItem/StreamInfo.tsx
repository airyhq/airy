import React from 'react';
import styles from './index.module.scss';

type StreamInfoProps = {
  streamName: string;
  topic: string;
  isExpanded: boolean;
  isJoinSelectionEnabled: boolean;
  selectedStreams: string[];
  isSelected: boolean;
  addStreamsToSelection: (topicName: string) => void;
  toggleExpanded: () => void;
};

const StreamInfo = (props: StreamInfoProps) => {
  const {
    streamName,
    topic,
    isExpanded,
    isSelected,
    isJoinSelectionEnabled,
    selectedStreams,
    addStreamsToSelection,
    toggleExpanded,
  } = props;

  return (
    <div className={`${styles.container} ${!isExpanded ? styles.expandedContainer : ''}`}>
      {isJoinSelectionEnabled && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            addStreamsToSelection(streamName);
          }}
          disabled={selectedStreams.length === 2 && !isSelected}
        />
      )}
      <div className={styles.name}>
        <div className={styles.blankSpace} />
        <p className={`${styles.componentName}`}>{streamName}</p>
      </div>
      <div className={styles.topic}>
        <div className={styles.blankSpace} />
        <p className={`${styles.componentTopic}`}>{topic}</p>
      </div>
      {/* <div className={styles.info} onClick={() => toggleExpanded()}>
        <div className={styles.blankSpace} />
        <p className={`${styles.infoComponent}`}>+info</p>
      </div> */}
    </div>
  );
};

export default StreamInfo;
