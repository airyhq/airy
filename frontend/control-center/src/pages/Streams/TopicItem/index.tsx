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

  const wrapperSection = useRef(null);
  const defaultHeight = 22;
  const basicHeight = 50;

  useEffect(() => {
    if (wrapperSection && wrapperSection.current) {
      if (isExpanded) {
        let lines = 0;
        if (schemas && schemas[topicName]) {
          lines = JSON.stringify(JSON.parse(schemas[topicName].schema), null, 4).split('\n').length;
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
  }, [isExpanded, schemas]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className={styles.wrapper} ref={wrapperSection} onClick={toggleExpanded}>
      <TopicInfo topicName={topicName} isExpanded={false} />
      {isExpanded && <TopicDescription topicName={topicName} />}
    </section>
  );
};

export default connector(TopicItem);
