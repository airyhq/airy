import React, {useEffect, useState} from 'react';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
// import JoinMode from './JoinMode';
import ListMode from './ListMode/ListMode';

export enum StreamsModes {
  list = 'list',
  select = 'select',
  join = 'join',
}

const Streams = () => {
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [mode, setMode] = useState<StreamsModes>(StreamsModes.list);

  useEffect(() => {
    setPageTitle('Streams');
  }, []);

  const addStreamsToSelection = (topicName: string) => {
    if (selectedStreams.includes(topicName)) {
      setSelectedStreams(selectedStreams.filter((topic: string) => topic !== topicName));
    } else {
      setSelectedStreams([...selectedStreams, topicName]);
    }
  };

  const getViewMode = () => {
    switch (mode) {
      case StreamsModes.list:
      case StreamsModes.select:
        return (
          <ListMode
            selectedStreams={selectedStreams}
            addStreamsToSelection={addStreamsToSelection}
            setSelectedStreams={setSelectedStreams}
            mode={mode}
            setMode={setMode}
          />
        );
      //   case StreamsModes.join:
      //     return <JoinMode selectedTopics={selectedTopics} setMode={setMode} />;
      default:
        return (
          <ListMode
            selectedStreams={selectedStreams}
            addStreamsToSelection={addStreamsToSelection}
            setSelectedStreams={setSelectedStreams}
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
