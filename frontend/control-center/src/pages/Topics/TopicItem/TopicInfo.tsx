import React from 'react';
import {ReactComponent as ChevronDown} from 'assets/images/icons/chevronDown.svg';
import {ConnectedProps, connect} from 'react-redux';
import styles from './index.module.scss';

type TopicInfoProps = {
  topicName: string;
  toggleExpanded: (item: string) => void;
  itemSelected: string;
} & ConnectedProps<typeof connector>;

const connector = connect(null, null);

const TopicInfo = (props: TopicInfoProps) => {
  const {topicName, toggleExpanded, itemSelected} = props;

  return (
    <div className={`${styles.container} ${itemSelected !== topicName ? styles.expandedContainer : ''}`}>
      <ChevronDown
        className={`${styles.chevron} ${itemSelected === topicName ? styles.chevronRotated : ''}`}
        onClick={() => toggleExpanded(topicName)}
      />
      <div className={styles.name}>
        <p className={`${styles.componentName}`} onClick={() => toggleExpanded(topicName)}>
          {topicName}
        </p>
      </div>
      <div className={styles.info} onClick={() => toggleExpanded(topicName)}>
        <div className={styles.blankSpace} />
        <p className={`${styles.infoComponent}`}>+info</p>
      </div>
    </div>
  );
};

export default connector(TopicInfo);
