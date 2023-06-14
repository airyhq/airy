import React, {useState} from 'react';
import {ReactComponent as TrashIcon} from 'assets/images/icons/trash.svg';
import {ReactComponent as ChevronDown} from 'assets/images/icons/chevronDown.svg';
import {Button, ListenOutsideClick} from 'components';
import {ConnectedProps, connect} from 'react-redux';
import {deleteTopic, getTopics} from '../../../actions';
import styles from './index.module.scss';

type TopicInfoProps = {
  topicName: string;
  isJoinSelectionEnabled: boolean;
  selectedTopics: string[];
  isSelected: boolean;
  addTopicsToSelection: (topicName: string) => void;
  toggleExpanded: (item: string) => void;
  itemSelected: string;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  deleteTopic,
  getTopics,
};

const connector = connect(null, mapDispatchToProps);

const TopicInfo = (props: TopicInfoProps) => {
  const {
    topicName,
    isSelected,
    isJoinSelectionEnabled,
    selectedTopics,
    addTopicsToSelection,
    toggleExpanded,
    itemSelected,
    deleteTopic,
    getTopics,
  } = props;

  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const deleteItem = () => {
    if (!confirmDeletion) {
      setConfirmDeletion(true);
    } else {
      setConfirmDeletion(false);
      deleteTopic(topicName)
        .then(() => {
          getTopics();
        })
        .catch(() => {
          deleteTopic(topicName + '-value');
        });
    }
  };

  return (
    <div className={`${styles.container} ${itemSelected !== topicName ? styles.expandedContainer : ''}`}>
      {isJoinSelectionEnabled ? (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            addTopicsToSelection(topicName);
          }}
          disabled={selectedTopics.length === 2 && !isSelected}
        />
      ) : (
        <ChevronDown
          className={`${styles.chevron} ${itemSelected === topicName ? styles.chevronRotated : ''}`}
          onClick={() => toggleExpanded(topicName)}
        />
      )}
      <div className={styles.name}>
        <p className={`${styles.componentName}`} onClick={() => toggleExpanded(topicName)}>
          {topicName}
        </p>
      </div>
      <div className={styles.info} onClick={() => toggleExpanded(topicName)}>
        <div className={styles.blankSpace} />
        <p className={`${styles.infoComponent}`}>+info</p>
      </div>
      <div className={styles.delete} onClick={() => deleteItem()}>
        <div className={styles.blankSpace} />
        {confirmDeletion ? (
          <ListenOutsideClick onOuterClick={() => setConfirmDeletion(false)}>
            <Button styleVariant="small" type="button" onClick={() => deleteItem()}>
              Confirm?
            </Button>
          </ListenOutsideClick>
        ) : (
          <TrashIcon />
        )}
      </div>
    </div>
  );
};

export default connector(TopicInfo);
