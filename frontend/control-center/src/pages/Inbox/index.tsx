import React, {useEffect, useState} from 'react';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';
import {setPageTitle} from '../../services/pageTitle';
import ChannelCard from '../Connectors/ChannelCard';
import styles from './index.module.scss';

const Inbox = () => {
  const [sourcesInfo, setSourcesInfo] = useState([]);

  useEffect(() => {
    setSourcesInfo(getSourcesInfo('Inbox'));
  }, []);

  useEffect(() => {
    setPageTitle('Inbox');
  }, []);

  return (
    <div className={styles.inboxWrapper}>
      <div className={styles.inboxHeadline}>
        <div>
          <h1 className={styles.inboxHeadlineText}>Inbox</h1>
        </div>
      </div>

      <div className={styles.channelsContainer}>
        <div style={{display: 'flex', flexDirection: 'column', marginBottom: '36px'}}>
          <span style={{marginBottom: '16px', marginTop: '16px', marginLeft: '36px'}}>Channels</span>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{width: '150px', height: '4px', background: '#1578D4'}}></div>
            <div style={{width: '100%', height: '1px', background: '#CAD5DB'}}></div>
          </div>
        </div>
        <div className={styles.wrapper}>
          {sourcesInfo.map((infoItem: SourceInfo) => {
            return <ChannelCard sourceInfo={infoItem} addChannelAction={() => {}} installed={true} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
