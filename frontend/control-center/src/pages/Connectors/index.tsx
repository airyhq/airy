import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {Channel, Source} from 'model';
import InfoCard from './InfoCard';
import {StateModel} from '../../reducers';
import {allChannelsConnected} from '../../selectors/channels';
import {listChannels, listComponents, getConnectorsConfiguration} from '../../actions';
import {setPageTitle} from '../../services/pageTitle';
import {EmptyStateConnectors} from './EmptyStateConnectors';
import {ChannelCard} from './ChannelCard';
import {SimpleLoader} from 'components';
import {getComponentStatus, formatComponentNameToConfigKey} from '../../services';
import styles from './index.module.scss';

export enum ComponentStatus {
  enabled = 'Enabled',
  notConfigured = 'Not Configured',
  disabled = 'Disabled',
}

export interface ConnectorCardComponentInfo {
  name: string;
  displayName: string;
  configKey: string;
  isChannel?: string;
  source: Source;
}

const mapDispatchToProps = {
  listChannels,
  getConnectorsConfiguration,
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

const Connectors = (props: ConnectedProps<typeof connector>) => {
  const {listChannels, getConnectorsConfiguration, listComponents} = props;
  const [connectorsPageList, setConnectorsPageList] = useState<[] | ConnectorCardComponentInfo[]>([]);
  const channels = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const components = useSelector((state: StateModel) => state.data.config.components);
  const connectors = useSelector((state: StateModel) => state.data.connector);
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);
  const [hasInstalledComponents, setHasInstalledComponents] = useState(false);
  const pageTitle = 'Connectors';

  const catalogListArr = Object.entries(catalogList);
  const emptyCatalogList = catalogListArr.length === 0;

  useEffect(() => {
    listChannels().catch((error: Error) => {
      console.error(error);
    });
    setPageTitle(pageTitle);
  }, []);

  useEffect(() => {
    getConnectorsConfiguration();
    if (emptyCatalogList) {
      listComponents().catch((error: Error) => {
        console.error(error);
      });
    } else {
      const listArr = [];
      catalogListArr.map(component => {
        if (component[1]?.name && component[1].installed === true && component[1].source !== 'webhooks') {
          setHasInstalledComponents(true);
          listArr.push({
            name: component[1].name,
            displayName: component[1].displayName,
            configKey: formatComponentNameToConfigKey(component[1].name),
            source: component[1].source,
            isChannel: component[1].isChannel,
          });
        }
      });

      setConnectorsPageList(listArr);
    }
  }, [catalogList]);

  return (
    <div className={styles.channelsWrapper}>
      <div className={styles.channelsHeadline}>
        <div>
          <h1 className={styles.channelsHeadlineText}>Connectors</h1>
          {emptyCatalogList && <SimpleLoader />}
        </div>
      </div>
      <div className={styles.wrapper}>
        {!hasInstalledComponents && catalogListArr.length > 0 ? (
          <EmptyStateConnectors />
        ) : (
          <>
            {connectorsPageList.map((item: ConnectorCardComponentInfo) => {
              if (components && components[item.configKey] && connectors[item.configKey] && catalogList[item.name]) {
                const isConfigured =
                  Object.keys(connectors[item.configKey]).length > 0 || item.source === Source.chatPlugin;
                const isEnabled = components[item.configKey]?.enabled;
                const isInstalled = catalogList[item.name].installed;

                if (item.isChannel === 'true') {
                  return (
                    <ChannelCard
                      key={item.displayName}
                      componentInfo={item}
                      componentStatus={getComponentStatus(isInstalled, isConfigured, isEnabled)}
                      channelsToShow={channelsBySource(item.source).length}
                    />
                  );
                }
                if (!item.isChannel) {
                  return (
                    <InfoCard
                      key={item.displayName}
                      componentInfo={item}
                      componentStatus={getComponentStatus(isInstalled, isConfigured, isEnabled)}
                    />
                  );
                }
              }
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default connector(Connectors);
