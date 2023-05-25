import React, {useEffect, useState} from 'react';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
// import JoinMode from './JoinMode';
import ListMode from './ListMode/ListMode';

export enum StreamsModes {
  list = 'list',
  join = 'join',
}

const Streams = () => {
  const [mode, setMode] = useState<StreamsModes>(StreamsModes.list);

  useEffect(() => {
    setPageTitle('Streams');
  }, []);

  const getViewMode = () => {
    switch (mode) {
      case StreamsModes.list:
        return <ListMode mode={mode} setMode={setMode} />;
      //   case StreamsModes.join:
      //     return <JoinMode selectedTopics={selectedTopics} setMode={setMode} />;
      default:
        return <ListMode mode={mode} setMode={setMode} />;
    }
  };

  return (
    <>
      <section className={styles.statusWrapper}>{getViewMode()}</section>
    </>
  );
};

export default Streams;
