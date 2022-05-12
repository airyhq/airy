import {Source} from 'model';
import {Channel} from 'model/Channel';
import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {listChannels} from '../../actions/channel';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';
import {StateModel} from '../../reducers';
import {allChannelsConnected} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';
import {ChannelCard} from '../Connectors/ChannelCard';
import {EmptyStateInbox} from './EmptyStateInbox';
import styles from './index.module.scss';

const mapDispatchToProps = {
  listChannels,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannelsConnected(state)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const Inbox = (props: ConnectedProps<typeof connector>) => {
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const channels = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);

  useEffect(() => {
    setSourcesInfo(getSourcesInfo('Inbox'));
  }, []);

  useEffect(() => {
    if (props.channels.length === 0) {
      props.listChannels();
    }
  }, [props.channels.length]);

  useEffect(() => {
    setPageTitle('Inbox');
  }, []);

  return (
    <div className={styles.inboxWrapper}>
      {sourcesInfo.length > 0 && (
        <div className={styles.inboxHeadline}>
          <div>
            <h1 className={styles.inboxHeadlineText}>Inbox</h1>
          </div>
        </div>
      )}
      <div className={styles.wrapper}>
        {sourcesInfo.length === 0 ? (
          <EmptyStateInbox />
        ) : (
          <div className={styles.channelsLine}>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: '36px'}}>
              <span style={{marginBottom: '16px', marginTop: '16px', marginLeft: '36px'}}>Channels</span>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{width: '150px', height: '4px', background: '#1578D4'}}></div>
                <div style={{width: '100%', height: '1px', background: '#CAD5DB'}}></div>
              </div>
            </div>
            <div className={styles.channelsContainer}>
              {sourcesInfo.map((infoItem: SourceInfo, index: number) => {
                if (channelsBySource(infoItem.type).length > 0) {
                  return <ChannelCard sourceInfo={infoItem} key={index} />;
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(Inbox);
