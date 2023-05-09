import React, {useState, useEffect, useRef} from 'react';
import StreamInfo from './StreamInfo';
import styles from './index.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import StreamDescription from './StreamDescription/StreamDescription';
import {formatJSON} from '../../../services';

const mapStateToProps = (state: StateModel) => {
  return {
    schemas: state.data.streams.schemas,
  };
};

const connector = connect(mapStateToProps, null);

type StreamItemProps = {
  streamName: string;
  topic: string;
  isJoinSelectionEnabled: boolean;
  selectedStreams: string[];
  addStreamsToSelection: (topicName: string) => void;
} & ConnectedProps<typeof connector>;

const StreamItem = (props: StreamItemProps) => {
  const {streamName, topic, schemas, isJoinSelectionEnabled, selectedStreams, addStreamsToSelection} = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState(formatJSON(schemas[streamName] ? schemas[streamName].schema : '{}'));

  const wrapperSection = useRef(null);
  const defaultHeight = 22;
  const basicHeight = 50;

  useEffect(() => {
    setCode(formatJSON(schemas[streamName] ? schemas[streamName].schema : '{}'));
  }, [schemas]);

  useEffect(() => {
    if (wrapperSection && wrapperSection.current) {
      if (isExpanded) {
        let lines = 0;
        if (schemas && schemas[streamName]) {
          if (schemas[streamName].schema !== code) {
            lines = code.split('\n').length;
          } else {
            lines = JSON.stringify(JSON.parse(schemas[streamName].schema), null, 4).split('\n').length;
          }
        }
        if (lines === 0) {
          wrapperSection.current.style.height = `${200}px`;
        } else {
          const val = basicHeight * 2 + defaultHeight * lines;
          wrapperSection.current.style.height = `${val}px`;
        }
      } else {
        wrapperSection.current.style.height = `${basicHeight}px`;
      }
    }
  }, [isExpanded, schemas, code]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const resetCode = () => {
    setCode(formatJSON(schemas[streamName] ? schemas[streamName].schema : '{}'));
  };

  let hasBeenModified = false;
  if (schemas[streamName]) {
    hasBeenModified = formatJSON(schemas[streamName].schema) !== code;
  }

  return (
    <section className={styles.wrapper} ref={wrapperSection}>
      <StreamInfo
        streamName={streamName}
        topic={topic}
        isExpanded={false}
        isJoinSelectionEnabled={isJoinSelectionEnabled}
        selectedStreams={selectedStreams}
        addStreamsToSelection={addStreamsToSelection}
        isSelected={selectedStreams.includes(streamName)}
        toggleExpanded={toggleExpanded}
      />
      {isExpanded && (
        <StreamDescription
          streamName={streamName}
          code={code}
          setCode={setCode}
          hasBeenModified={hasBeenModified}
          resetCode={resetCode}
        />
      )}
    </section>
  );
};

export default connector(StreamItem);
