import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import {setPageTitle} from '../../services/pageTitle';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';
import {AiryLoader} from 'components/loaders/AiryLoader';
import {StateModel} from '../../reducers';
import {getTopics} from '../../actions';
import TopicItem from './TopicItem';
import {getValidTopics} from '../../selectors';

const mapDispatchToProps = {
  getTopics,
};

const mapStateToProps = (state: StateModel) => {
  return {
    streams: getValidTopics(state),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Streams = (props: ConnectedProps<typeof connector>) => {
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
    <section className={styles.statusWrapper}>
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
            <button onClick={handleRefresh} className={styles.refreshButton}>
              <div className={spinAnim ? styles.spinAnimationIn : styles.spinAnimationOut}>
                <RefreshIcon />
              </div>
            </button>
          </div>
          <div className={styles.listItems}>
            {streams.map(component => {
              return <TopicItem topicName={component} />;
            })}
          </div>
        </>
      ) : (
        <AiryLoader height={240} width={240} position="relative" />
      )}
    </section>
  );
};

export default connector(Streams);
