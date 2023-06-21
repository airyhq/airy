import React, {useEffect, useState} from 'react';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
import ListMode from './ListMode/ListMode';

export enum TopicsModes {
  list = 'list',
}

const Topics = () => {
  const [mode, setMode] = useState<TopicsModes>(TopicsModes.list);

  useEffect(() => {
    setPageTitle('Streams');
  }, []);

  const getViewMode = () => {
    switch (mode) {
      case TopicsModes.list:
        return <ListMode setMode={setMode} />;
      default:
        return <ListMode setMode={setMode} />;
    }
  };

  return (
    <>
      <section className={styles.statusWrapper}>{getViewMode()}</section>
    </>
  );
};

export default Topics;
