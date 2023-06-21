import React, {useEffect, useRef} from 'react';
import TopicInfo from './TopicInfo';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import TopicDescription from './TopicDescription/TopicDescription';
import {formatJSON} from '../../../services';
import {getTopicInfo} from '../../../actions';
import styles from './index.module.scss';

const mapDispatchToProps = {
  getTopicInfo,
};

const mapStateToProps = (state: StateModel) => {
  return {
    topicsInfo: state.data.streams.topicsInfo,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TopicItemProps = {
  topicName: string;
  itemSelected: string;
  setItemSelected: (item: string) => void;
} & ConnectedProps<typeof connector>;

const TopicItem = (props: TopicItemProps) => {
  const {topicName, topicsInfo, itemSelected, setItemSelected, getTopicInfo} = props;
  const wrapperSection = useRef(null);

  useEffect(() => {
    if (itemSelected !== topicName) wrapperSection.current.style.height = `50px`;
  }, [itemSelected]);

  const toggleExpanded = (item: string) => {
    if (itemSelected === topicName) {
      setItemSelected('');
    } else {
      setItemSelected(item);
      getTopicInfo(topicName);
    }
  };

  const getTopicInfoString = () => {
    return formatJSON(JSON.stringify(topicsInfo[topicName]));
  };

  return (
    <section className={styles.wrapper} ref={wrapperSection}>
      <TopicInfo topicName={topicName} toggleExpanded={toggleExpanded} itemSelected={itemSelected} />
      {itemSelected === topicName && (
        <TopicDescription topicName={topicName} code={getTopicInfoString()} wrapperSection={wrapperSection} />
      )}
    </section>
  );
};

export default connector(TopicItem);
