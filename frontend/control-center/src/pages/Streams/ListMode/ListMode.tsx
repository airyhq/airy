import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import {setPageTitle} from '../../../services/pageTitle';
import {AiryLoader} from 'components/loaders/AiryLoader';
import {StateModel} from '../../../reducers';
import StreamItem from '../StreamItem';
import {StreamsModes} from '..';
import {getStreams} from '../../../actions';
import {Button} from 'components';
import {useTranslation} from 'react-i18next';
import styles from '../index.module.scss';
import {Stream} from 'model';

const mapDispatchToProps = {
  getStreams,
};

const mapStateToProps = (state: StateModel) => {
  return {
    streams: state.data.streams.streams,
  };
};

type ListModeProps = {
  setMode: (mode: StreamsModes) => void;
} & ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

const ListMode = (props: ListModeProps) => {
  const {setMode} = props;
  const {streams, getStreams} = props;
  const [spinAnim, setSpinAnim] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleString());
  const [itemSelected, setItemSelected] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    setPageTitle('Streams');
    getStreams()
      .then(() => {
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
      .getStreams()
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
      {!(isLoading && !Object.entries(streams).length) ? (
        <>
          <div className={styles.listHeader}>
            <h2>{t('name')}</h2>
            <h2>{t('topicsName')}</h2>
            <Button
              className={styles.listHeaderButton}
              styleVariant="green"
              onClick={() => {
                setMode(StreamsModes.creation);
              }}
            >
              JOIN
            </Button>
            <button onClick={handleRefresh} className={styles.refreshButton}>
              <div className={spinAnim ? styles.spinAnimationIn : styles.spinAnimationOut}>
                <RefreshIcon />
              </div>
            </button>
          </div>
          <div className={styles.listItems}>
            {Object.entries(streams).length > 0 ? (
              streams.map((stream: Stream) => {
                return (
                  <StreamItem
                    key={stream.topic}
                    streamName={stream.name}
                    topic={stream.topic}
                    itemSelected={itemSelected}
                    setItemSelected={setItemSelected}
                  />
                );
              })
            ) : (
              <StreamItem
                key="empty"
                streamName="No data"
                topic="No data"
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
