import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Channel, Source, getSourceForComponent} from 'model';
import InfoCard, {InfoCardStyle} from '../../components/InfoCard';
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
import {SimpleLoader} from 'components';
import {getComponentStatus} from '../../services/getComponentStatus';

export enum ComponentStatus {
  enabled = 'Enabled',
  notConfigured = 'Not Configured',
  disabled = 'Disabled',
}

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
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);
  const [sourcesInfo, setSourcesInfo] = useState([]);
  const [hasInstalledComponents, setHasInstalledComponents] = useState(false);
  const navigate = useNavigate();
  const pageTitle = 'Connectors';
  const isInstalled = true;

  useEffect(() => {
    setSourcesInfo(getSourcesInfo());
    getConnectorsConfiguration();
    if (Object.entries(catalogList).length === 0) listComponents();
    if (Object.entries(catalogList).length > 0)
      Object.entries(catalogList).map(component => {
        component[1].installed === true && setHasInstalledComponents(true);
      });
  }, [catalogList]);

  useEffect(() => {
    if (channels.length === 0) {
      listChannels();
    }
    setPageTitle(pageTitle);
  }, [channels.length]);

  const isComponentInstalled = (repository: string, componentName: string) => {
    const componentNameCatalog = repository + '/' + componentName;
    return catalogList[componentNameCatalog] && catalogList[componentNameCatalog].installed === true;
  };

  return (
    <div className={styles.channelsWrapper}>
      {sourcesInfo.length > 0 && (
        <div className={styles.channelsHeadline}>
          <div>
            <h1 className={styles.channelsHeadlineText}>Connectors</h1>
            {Object.entries(catalogList).length === 0 && <SimpleLoader />}
          </div>
        </div>
      )}
      <div className={styles.wrapper}>
        {!hasInstalledComponents && Object.entries(catalogList).length > 0 ? (
          <EmptyStateConnectors />
        ) : (
          <>
            {sourcesInfo.map((infoItem: SourceInfo, index: number) => {
              return (
                (components &&
                  components[infoItem?.configKey] &&
                  isInstalled &&
                  connectors[infoItem.configKey] &&
                  infoItem.channel &&
                  isComponentInstalled(infoItem.repository, infoItem.componentName) && (
                    <ChannelCard
                      sourceInfo={infoItem}
                      channelsToShow={channelsBySource(infoItem.type).length}
                      componentStatus={getComponentStatus(
                        isInstalled,
                        Object.keys(connectors[infoItem.configKey]).length > 0 || infoItem.type === Source.chatPlugin,
                        components[infoItem.configKey]?.enabled
                      )}
                      key={index}
                    />
                  )) ||
                (channelsBySource(infoItem.type).length > 0 &&
                  !infoItem.channel &&
                  isComponentInstalled(infoItem.repository, infoItem.componentName) && (
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
                  !infoItem.channel &&
                  isComponentInstalled(infoItem.repository, infoItem.componentName) && (
                    <div className={styles.cardContainer} key={infoItem.type}>
                      <InfoCard
                        installed={true}
                        componentStatus={getComponentStatus(
                          isInstalled,
                          Object.keys(connectors[infoItem.configKey]).length > 0,
                          components[infoItem?.configKey].enabled
                        )}
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
