import React, {useEffect, useState} from 'react';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
import ListMode from './ListMode/ListMode';
import Creation from './Creation';

export enum StreamsModes {
  list = 'list',
  join = 'join',
  creation = 'creation',
}

const Streams = () => {
  const [mode, setMode] = useState<StreamsModes>(StreamsModes.list);

  useEffect(() => {
    setPageTitle('Streams');
  }, []);

  const getViewMode = () => {
    switch (mode) {
      case StreamsModes.list:
        return <ListMode setMode={setMode} />;
      case StreamsModes.creation:
        return <Creation />;
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

export default Streams;
