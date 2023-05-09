import React, {useEffect, useState} from 'react';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
import JoinMode from './JoinMode';
import ListMode from './ListMode/ListMode';
import {ListenOutsideClick} from 'components';
import {ReactComponent as NewIcon} from 'assets/images/icons/new.svg';
import {ReactComponent as MergeIcon} from 'assets/images/icons/merge.svg';

export enum TopicsMode {
  list = 'list',
  select = 'select',
  join = 'join',
}

const Topics = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [mode, setMode] = useState<TopicsMode>(TopicsMode.list);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [fromScratch, setFromScratch] = useState(false);

  useEffect(() => {
    setPageTitle('Topics');
  }, []);

  const addTopicsToSelection = (topicName: string) => {
    if (selectedTopics.includes(topicName)) {
      setSelectedTopics(selectedTopics.filter((topic: string) => topic !== topicName));
    } else {
      setSelectedTopics([...selectedTopics, topicName]);
    }
  };

  const PopUpSelector = () => {
    return (
      <div className={styles.popUpContainer}>
        <ListenOutsideClick onOuterClick={() => setPopupEnabled(false)}>
          <div className={styles.popUpView}>
            <div
              className={styles.popUpItems}
              onClick={() => {
                setFromScratch(true);
                setMode(TopicsMode.join);                
                setPopupEnabled(false);
              }}
            >
              Create from scratch
              <NewIcon />
            </div>
            <div
              className={styles.popUpItems}
              onClick={() => {       
                setFromScratch(false);         
                setMode(TopicsMode.select);                
                setPopupEnabled(false);
              }}
            >
              Create from existing topics
              <MergeIcon />
            </div>
          </div>
        </ListenOutsideClick>
      </div>
    );
  };

  const getViewMode = () => {
    switch (mode) {
      case TopicsMode.list:
      case TopicsMode.select:
        return (
          <ListMode
            selectedTopics={selectedTopics}
            addTopicsToSelection={addTopicsToSelection}
            setSelectedTopics={setSelectedTopics}
            mode={mode}
            setMode={setMode}
            setPopupEnabled={setPopupEnabled}
          />
        );
      case TopicsMode.join:
        return <JoinMode selectedTopics={selectedTopics} setMode={setMode} fromScratch={fromScratch}/>;
      default:
        return (
          <ListMode
            selectedTopics={selectedTopics}
            addTopicsToSelection={addTopicsToSelection}
            setSelectedTopics={setSelectedTopics}
            mode={mode}
            setMode={setMode}
            setPopupEnabled={setPopupEnabled}
          />
        );
    }
  };

  return (
    <>
      <section className={styles.statusWrapper}>{getViewMode()}</section>
      {popupEnabled && <PopUpSelector />}
    </>
  );
};

export default Topics;
