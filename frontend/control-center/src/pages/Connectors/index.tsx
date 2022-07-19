import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Channel, Source, getSourceForComponent} from 'model';
import InfoCard, {InfoCardStyle} from './InfoCard';
import {StateModel} from '../../reducers';
import {allChannelsConnected} from '../../selectors/channels';
import {listChannels} from '../../actions/channel';
import {listComponents} from '../../actions/catalog';
import {setPageTitle} from '../../services/pageTitle';
import {getConnectorsConfiguration} from '../../actions';
import {getSourcesInfo, SourceInfo} from '../../components/SourceInfo';
import styles from './index.module.scss';
import {EmptyStateConnectors} from './EmptyStateConnectors';
import {ChannelCard} from './ChannelCard';

const mapDispatchToProps = {
  listChannels,
  getConnectorsConfiguration,
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

const Connectors = (props: ConnectedProps<typeof connector>) => {
  const {listChannels, getConnectorsConfiguration, listComponents} = props;
  const channels = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const components = useSelector((state: StateModel) => state.data.config.components);
  const connectors = useSelector((state: StateModel) => state.data.connector);
  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const navigate = useNavigate();
  const pageTitle = 'Connectors';

  useEffect(() => {
    setSourcesInfo(getSourcesInfo());
    getConnectorsConfiguration();
    listComponents();
  }, []);

  useEffect(() => {
    if (channels.length === 0) {
      listChannels();
    }
    setPageTitle(pageTitle);
  }, [channels.length]);

  const isComponentEnabled = (componentName: string, configKey: string) => {
    if (connectors[componentName]) {
      const componentConfigured = Object.keys(connectors[componentName]).length > 0;
      return connectors[componentName] && componentConfigured && components[configKey].enabled
        ? 'Enabled'
        : !componentConfigured && components[configKey].enabled
        ? 'Not Configured'
        : 'Disabled';
    }
  };
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
            {sourcesInfo.map((infoItem: SourceInfo, index: number) => {
              return (
                (channelsBySource(infoItem.type).length > 0 && infoItem.channel && (
                  <ChannelCard
                    sourceInfo={infoItem}
                    channelsToShow={channelsBySource(infoItem.type).length}
                    key={index}
                  />
                )) ||
                (channelsBySource(infoItem.type).length > 0 && !infoItem.channel && (
                  <div className={styles.cardContainer} key={infoItem.type}>
                    <InfoCard
                      installed
                      style={InfoCardStyle.expanded}
                      sourceInfo={infoItem}
                      addChannelAction={() => {
                        navigate(infoItem.channelsListRoute);
                      }}
                    />
                  </div>
                )) ||
                (getSourceForComponent(infoItem.type) &&
                  components &&
                  components[infoItem.configKey] &&
                  !infoItem.channel && (
                    <div className={styles.cardContainer} key={infoItem.type}>
                      <InfoCard
                        installed={true}
                        enabled={isComponentEnabled(infoItem?.componentName, infoItem?.configKey)}
                        style={InfoCardStyle.normal}
                        key={infoItem.type}
                        sourceInfo={infoItem}
                        addChannelAction={() => {
                          navigate(infoItem.channelsListRoute);
                        }}
                      />
                    </div>
                  ))
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default connector(Connectors);
