import React, {useState, useEffect, useRef} from 'react';
import TopicInfo from './TopicInfo';
import styles from './index.module.scss';
import TopicDescription from './TopicDescription/TopicDescription';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';

const mapStateToProps = (state: StateModel) => {
  return {
    schemas: state.data.streams.schemas,
  };
};

const connector = connect(mapStateToProps, null);

type TopicItemProps = {
  topicName: string;
} & ConnectedProps<typeof connector>;

const TopicItem = (props: TopicItemProps) => {
  const {topicName, schemas} = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [code, setCode] = useState(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));

  const wrapperSection = useRef(null);
  const defaultHeight = 22;
  const basicHeight = 50;

  useEffect(() => {
    setCode(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));
  }, [schemas]);

  useEffect(() => {
    if (wrapperSection && wrapperSection.current) {
      if (isExpanded) {
        let lines = 0;
        if (schemas && schemas[topicName]) {
          if (schemas[topicName].schema !== code) {
            console.log(code);
            lines = code.split('\n').length;
          } else {
            lines = JSON.stringify(JSON.parse(schemas[topicName].schema), null, 4).split('\n').length;
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
    setCode(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));
  };

  let hasBeenModified = false;
  if (schemas[topicName]) {
    hasBeenModified = formatJSON(schemas[topicName].schema) !== code;
  }

  return (
    <section className={styles.wrapper} ref={wrapperSection} onClick={toggleExpanded}>
      <TopicInfo topicName={topicName} isExpanded={false} />
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

const formatJSON = (jsonString: string): string => {
  if (jsonString) {
    return JSON.stringify(JSON.parse(jsonString), null, 4);
  }
  return '';
};
