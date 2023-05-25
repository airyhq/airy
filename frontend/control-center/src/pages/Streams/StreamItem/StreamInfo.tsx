import React, {useState} from 'react';
import {Button, ListenOutsideClick} from 'components';
import {ReactComponent as TrashIcon} from 'assets/images/icons/trash.svg';
import styles from './index.module.scss';
import {ConnectedProps, connect} from 'react-redux';
import {deleteStream, getStreams} from '../../../actions';

type StreamInfoProps = {
  streamName: string;
  topicName: string;
  toggleExpanded: (item: string) => void;
  itemSelected: string;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  deleteStream,
  getStreams,
};

const connector = connect(null, mapDispatchToProps);

const StreamInfo = (props: StreamInfoProps) => {
  const {streamName, topicName, toggleExpanded, itemSelected, deleteStream, getStreams} = props;

  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const deleteItem = () => {
    if (!confirmDeletion) {
      setConfirmDeletion(true);
    } else {
      setConfirmDeletion(false);
      deleteStream(streamName).then(() => {
        getStreams();
      });
    }
  };

  return (
    <div className={`${styles.container} ${itemSelected !== streamName ? styles.expandedContainer : ''}`}>
      <div className={styles.name}>
        <div className={styles.blankSpace} />
        <p className={`${styles.componentName}`}>{streamName}</p>
      </div>
      <div className={styles.topic}>
        <div className={styles.blankSpace} />
        <p className={`${styles.componentName}`}>{topicName}</p>
      </div>
      <div className={styles.info} onClick={() => toggleExpanded(streamName)}>
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

export default connector(StreamInfo);
