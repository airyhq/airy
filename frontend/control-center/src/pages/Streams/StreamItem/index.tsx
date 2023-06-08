import React, {useEffect, useRef} from 'react';
import StreamInfo from './StreamInfo';
import styles from './index.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import StreamDescription from './StreamDescription/StreamDescription';
import {formatJSON} from '../../../services';

const mapStateToProps = (state: StateModel) => {
  return {
    streamsInfo: state.data.streams.streamsInfo,
  };
};

const connector = connect(mapStateToProps, null);

type StreamItemProps = {
  streamName: string;
  topic: string;
  itemSelected: string;
  setItemSelected: (item: string) => void;
} & ConnectedProps<typeof connector>;

const StreamItem = (props: StreamItemProps) => {
  const {streamName, topic, streamsInfo, itemSelected, setItemSelected} = props;
  const wrapperSection = useRef(null);

  useEffect(() => {
    if (itemSelected !== streamName) wrapperSection.current.style.height = `50px`;
  }, [itemSelected]);

  const toggleExpanded = (item: string) => {
    if (itemSelected === streamName) {
      setItemSelected('');
    } else {
      setItemSelected(item);
    }
  };

  const getStreamInfoString = () => {
    return formatJSON(JSON.stringify(streamsInfo[streamName]));
  };

  return (
    <section className={styles.wrapper} ref={wrapperSection}>
      <StreamInfo
        streamName={streamName}
        topicName={topic}
        toggleExpanded={toggleExpanded}
        itemSelected={itemSelected}
      />
      {itemSelected === streamName && (
        <StreamDescription streamName={streamName} code={getStreamInfoString()} wrapperSection={wrapperSection} />
      )}
    </section>
  );
};

export default connector(StreamItem);
