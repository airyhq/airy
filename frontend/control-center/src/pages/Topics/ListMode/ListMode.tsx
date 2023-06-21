import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import {setPageTitle} from '../../../services/pageTitle';
import {AiryLoader} from 'components/loaders/AiryLoader';
import {StateModel} from '../../../reducers';
import {TopicsModes} from '..';
import TopicItem from '../TopicItem';
import {getTopics} from '../../../actions';
import {useTranslation} from 'react-i18next';
import styles from '../index.module.scss';

const mapDispatchToProps = {
  getTopics,
};

const mapStateToProps = (state: StateModel) => {
  return {
    topics: state.data.streams.topics,
  };
};

type ListModeProps = {} & ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

const ListMode = (props: ListModeProps) => {
  const {getTopics} = props;
  const {topics} = props;
  const [spinAnim, setSpinAnim] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleString());
  const [itemSelected, setItemSelected] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    setPageTitle('Topics');
    getTopics().then(() => {
      setLastRefresh(new Date().toLocaleString());
    })
    .catch((error: Error) => {
      console.error(error);
    });
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);
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
        <h1>{t('topics')}</h1>
        <span>
          Last Refresh: <br />
          {lastRefresh}
        </span>
      </div>
      {!(isLoading && !Object.entries(topics).length) ? (
        <>
          <div className={styles.listHeader}>
            <h2>{t('name')}</h2>
            <button onClick={handleRefresh} className={styles.refreshButton}>
              <div className={spinAnim ? styles.spinAnimationIn : styles.spinAnimationOut}>
                <RefreshIcon />
              </div>
            </button>
          </div>
          <div className={styles.listItems}>
            {Object.entries(topics).length > 0 ? (
              topics.map(topic => {
                return (
                  <TopicItem
                    key={topic}
                    topicName={topic}
                    itemSelected={itemSelected}
                    setItemSelected={setItemSelected}
                  />
                );
              })
            ) : (
              <TopicItem
                key="empty"
                topicName="No data"
                itemSelected={itemSelected}
                setItemSelected={setItemSelected}
              />
            )}
          </div>
        </>
      ) : (
        <AiryLoader height={240} width={240} position="relative" />
      )}
    </>
  );
};

export default connector(ListMode);
