import React, {useEffect, useState} from 'react';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
import JoinMode from './JoinMode';
import ListMode from './ListMode/ListMode';

export enum StreamModes {
  list = 'list',
  select = 'select',
  join = 'join',
}

const Streams = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [mode, setMode] = useState<StreamModes>(StreamModes.list);

  useEffect(() => {
    setPageTitle('Streams');
  }, []);

  const addTopicsToSelection = (topicName: string) => {
    if (selectedTopics.includes(topicName)) {
      setSelectedTopics(selectedTopics.filter((topic: string) => topic !== topicName));
    } else {
      setSelectedTopics([...selectedTopics, topicName]);
    }
  };

  const getViewMode = () => {
    switch (mode) {
      case StreamModes.list:
      case StreamModes.select:
        return (
          <ListMode
            selectedTopics={selectedTopics}
            addTopicsToSelection={addTopicsToSelection}
            setSelectedTopics={setSelectedTopics}
            mode={mode}
            setMode={setMode}
          />
        );
      case StreamModes.join:
        return <JoinMode selectedTopics={selectedTopics} setMode={setMode} />;
      default:
        return (
          <ListMode
            selectedTopics={selectedTopics}
            addTopicsToSelection={addTopicsToSelection}
            setSelectedTopics={setSelectedTopics}
            mode={mode}
            setMode={setMode}
          />
        );
    }
  };

  return (
    <>
      <section className={styles.statusWrapper}>{getViewMode()}</section>
    </>
  );
};

export default Streams;
