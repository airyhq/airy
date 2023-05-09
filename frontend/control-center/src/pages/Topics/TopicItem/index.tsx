import React, {useState, useEffect, useRef} from 'react';
import TopicInfo from './TopicInfo';
import styles from './index.module.scss';
import TopicDescription from './TopicDescription/TopicDescription';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import {calculateHeightOfCodeString, formatJSON} from '../../../services';

const mapStateToProps = (state: StateModel) => {
  return {
    schemas: state.data.streams.schemas,
  };
};

const connector = connect(mapStateToProps, null);

type TopicItemProps = {
  topicName: string;
  isJoinSelectionEnabled: boolean;
  selectedTopics: string[];
  addTopicsToSelection: (topicName: string) => void;
} & ConnectedProps<typeof connector>;

const TopicItem = (props: TopicItemProps) => {
  const {topicName, schemas, isJoinSelectionEnabled, selectedTopics, addTopicsToSelection} = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));

  const wrapperSection = useRef(null);
  const basicHeight = 50;
  const headerHeight = 32;

  useEffect(() => {
    setCode(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));
  }, [schemas]);

  useEffect(() => {
    if (wrapperSection && wrapperSection.current) {
      if (isExpanded) {
        if (schemas && schemas[topicName]) {
          if (schemas[topicName].schema !== code) {
            wrapperSection.current.style.height = `${calculateHeightOfCodeString(code) + headerHeight + basicHeight}px`;
          } else {
            wrapperSection.current.style.height = `${
              calculateHeightOfCodeString(schemas[topicName].schema) + headerHeight + basicHeight
            }px`;
          }
        } else {
          wrapperSection.current.style.height = `${basicHeight}px`;
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
    setCode(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));
  };

  let hasBeenModified = false;
  if (schemas[topicName]) {    
    hasBeenModified = formatJSON(schemas[topicName].schema) !== code;
  }

  return (
    <section className={styles.wrapper} ref={wrapperSection}>
      <TopicInfo
        topicName={topicName}
        isExpanded={false}
        isJoinSelectionEnabled={isJoinSelectionEnabled}
        selectedTopics={selectedTopics}
        addTopicsToSelection={addTopicsToSelection}
        isSelected={selectedTopics.includes(topicName)}
        toggleExpanded={toggleExpanded}
      />
      {isExpanded && (
        <TopicDescription
          topicName={topicName}
          code={code}
          setCode={setCode}
          hasBeenModified={hasBeenModified}
          resetCode={resetCode}
        />
      )}
    </section>
  );
};

export default connector(TopicItem);
