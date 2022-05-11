import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Channel, Source} from 'model';
import InfoCard, {InfoCardStyle} from './InfoCard';
import {StateModel} from '../../reducers';
import {allChannelsConnected} from '../../selectors/channels';
import {listChannels} from '../../actions/channel';
import {setPageTitle} from '../../services/pageTitle';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';
import styles from './index.module.scss';
import {EmptyStateConnectors} from './EmptyStateConnectors';
import {ChannelCard} from '../Inbox/ChannelCard';

const mapDispatchToProps = {
  listChannels,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannelsConnected(state)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const Connectors = (props: ConnectedProps<typeof connector>) => {
  const channels = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const navigate = useNavigate();
  const pageTitle = 'Connectors';

  useEffect(() => {
    setSourcesInfo(getSourcesInfo(pageTitle));
  }, []);

  useEffect(() => {
    if (props.channels.length === 0) {
      props.listChannels();
    }
    setPageTitle(pageTitle);
  }, [props.channels.length]);

  return (
    <div className={styles.channelsWrapper}>
      {sourcesInfo.length > 0 && (
        <div className={styles.channelsHeadline}>
          <div>
            <h1 className={styles.channelsHeadlineText}>Connectors</h1>
          </div>
        </div>
      )}
      <div className={styles.wrapper}>
        {sourcesInfo.length === 0 ? (
          <EmptyStateConnectors />
        ) : (
          <>
            {sourcesInfo.map(
              (infoItem: SourceInfo, index: number) =>
                (channelsBySource(infoItem.type).length > 0 && infoItem.channel && (
                  <ChannelCard
                    sourceInfo={infoItem}
                    channelsToShow={channelsBySource(infoItem.type).length}
                    key={index}
                  />
                )) ||
                (channelsBySource(infoItem.type).length > 0 && !infoItem.channel && (
                  <div style={{display: 'flex'}} key={infoItem.type}>
                    <InfoCard
                      installed
                      style={InfoCardStyle.expanded}
                      sourceInfo={infoItem}
                      addChannelAction={() => {
                        navigate(infoItem.channelsListRoute);
                      }}
                    />
                  </div>
                ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default connector(Connectors);
