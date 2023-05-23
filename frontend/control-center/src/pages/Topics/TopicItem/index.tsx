import React, {useState, useEffect, useRef} from 'react';
import TopicInfo from './TopicInfo';
import styles from './index.module.scss';
import TopicDescription from './TopicDescription/TopicDescription';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import {formatJSON} from '../../../services';

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
  itemSelected: string;
  setItemSelected: (item: string) => void;
} & ConnectedProps<typeof connector>;

const TopicItem = (props: TopicItemProps) => {
  const {
    topicName,
    schemas,
    isJoinSelectionEnabled,
    selectedTopics,
    addTopicsToSelection,
    itemSelected,
    setItemSelected,
  } = props;
  const [code, setCode] = useState(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));

  const wrapperSection = useRef(null);

  useEffect(() => {
    setCode(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));
  }, [schemas]);

  useEffect(() => {
    if (itemSelected !== topicName) wrapperSection.current.style.height = `50px`;
  }, [itemSelected]);

  const toggleExpanded = (item: string) => {
    if (itemSelected === topicName) {
      setItemSelected('');
    } else {
      setItemSelected(item);
    }
  };

  const getVersion = (): number => {
    if (schemas[topicName]) return schemas[topicName].version;
    return 1;
  };

  return (
    <section className={styles.wrapper} ref={wrapperSection}>
      <TopicInfo
        topicName={topicName}
        isJoinSelectionEnabled={isJoinSelectionEnabled}
        selectedTopics={selectedTopics}
        addTopicsToSelection={addTopicsToSelection}
        isSelected={selectedTopics.includes(topicName)}
        toggleExpanded={toggleExpanded}
        itemSelected={itemSelected}
      />
      {itemSelected === topicName && (
        <TopicDescription
          topicName={topicName}
          code={code}
          setCode={setCode}
          wrapperSection={wrapperSection}
          version={getVersion()}
        />
      )}
    </section>
  );
};

export default connector(TopicItem);
