import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import {setPageTitle} from '../../../services/pageTitle';
import {AiryLoader} from 'components/loaders/AiryLoader';
import {StateModel} from '../../../reducers';
import {getTopics} from '../../../actions';
import TopicItem from '../TopicItem';
import {getValidTopics} from '../../../selectors';
import {Button} from 'components';
import {useTranslation} from 'react-i18next';
import styles from '../index.module.scss';
import {StreamModes} from '..';

const mapDispatchToProps = {
  getTopics,
};

const mapStateToProps = (state: StateModel) => {
  return {
    streams: getValidTopics(state),
  };
};

type ListModeProps = {
  selectedTopics: string[];
  addTopicsToSelection: (topicName: string) => void;
  setSelectedTopics: (topics: string[]) => void;
  mode: StreamModes;
  setMode: (mode: StreamModes) => void;
} & ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

const ListMode = (props: ListModeProps) => {
  const {selectedTopics, setSelectedTopics, addTopicsToSelection, mode, setMode} = props;
  const {streams, getTopics} = props;
  const [spinAnim, setSpinAnim] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleString());
  const {t} = useTranslation();

  useEffect(() => {
    setPageTitle('Streams');
    getTopics()
      .then(() => {
        setLastRefresh(new Date().toLocaleString());
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, []);

  const handleRefresh = () => {
    props
      .getTopics()
      .then(() => {
        setLastRefresh(new Date().toLocaleString());
      })
      .catch((error: Error) => {
        console.error(error);
      });
    setSpinAnim(!spinAnim);
  };

  return (
    <>
      <div className={styles.statusLastRefreshContainer}>
        <h1>{t('streams')}</h1>
        <span>
          Last Refresh: <br />
          {lastRefresh}
        </span>
      </div>
      {Object.entries(streams).length > 0 ? (
        <>
          <div className={styles.listHeader}>
            <h2>{t('topicsName')}</h2>
            <Button
              className={`${mode === StreamModes.select ? styles.listHeaderButtonConfirm : styles.listHeaderButton}`}
              styleVariant="green"
              onClick={() => {
                if (mode === StreamModes.list) {
                  setMode(StreamModes.select);
                } else {
                  setMode(StreamModes.join);
                }
              }}
            >
              {mode === StreamModes.select ? t('confirm').toLocaleUpperCase() : 'JOIN'}
            </Button>
            {mode === StreamModes.select && (
              <Button
                className={styles.listHeaderButtonConfirm}
                styleVariant="warning"
                onClick={() => {
                  setMode(StreamModes.list);
                  setSelectedTopics([]);
                }}
              >
                {t('cancel').toLocaleUpperCase()}
              </Button>
            )}
            <button onClick={handleRefresh} className={styles.refreshButton}>
              <div className={spinAnim ? styles.spinAnimationIn : styles.spinAnimationOut}>
                <RefreshIcon />
              </div>
            </button>
          </div>
          <div className={styles.listItems}>
            {streams.map(component => {
              return (
                <TopicItem
                  key={component}
                  topicName={component}
                  isJoinSelectionEnabled={mode === StreamModes.select}
                  selectedTopics={selectedTopics}
                  addTopicsToSelection={addTopicsToSelection}
                />
              );
            })}
          </div>
        </>
      ) : (
        <AiryLoader height={240} width={240} position="relative" />
      )}
    </>
  );
};

export default connector(ListMode);
