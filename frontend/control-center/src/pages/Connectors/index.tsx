import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Channel, Source} from 'model';
import InfoCard, {InfoCardStyle} from './InfoCard';
import {StateModel} from '../../reducers';
import {allChannelsConnected} from '../../selectors/channels';
import {listChannels, listComponents, getConnectorsConfiguration} from '../../actions';
import {setPageTitle} from '../../services/pageTitle';
import {EmptyStateConnectors} from './EmptyStateConnectors';
import {ChannelCard} from './ChannelCard';
import {SimpleLoader} from 'components';
import {getComponentStatus, formatComponentNameToConfigKey} from '../../services';
import {CONNECTORS_CONNECTED_ROUTE} from '../../routes/routes';
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
  source: string;
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
  const navigate = useNavigate();
  const pageTitle = 'Connectors';
  const isInstalled = true;

  const catalogListArr = Object.entries(catalogList);
  const emptyCatalogList = catalogListArr.length === 0;

  useEffect(() => {
    getConnectorsConfiguration();
    if (emptyCatalogList) {
      listComponents().catch((error: Error) => {
        console.error(error);
      });
    } else {
      const listArr = [];
      catalogListArr.map(component => {
        if (component[1].installed === true && component[1].source !== 'webhooks') {
          setHasInstalledComponents(true);
          listArr.push({
            name: component[1].name,
            displayName: component[1].displayName,
            configKey: formatComponentNameToConfigKey(component[1].name),
            source: component[1].source,
          });
        }
      });

      setConnectorsPageList(listArr);
    }
  }, [catalogList]);

  useEffect(() => {
    if (channels.length === 0) {
      listChannels().catch((error: Error) => {
        console.error(error);
      });
    }
    setPageTitle(pageTitle);
  }, [channels.length]);

  const isComponentInstalled = (componentNameCatalog: string) => {
    return catalogList[componentNameCatalog] && catalogList[componentNameCatalog].installed === true;
  };

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
            {connectorsPageList.map((item: {name: string; displayName: string; configKey: string; source: Source}) => {
              return (
                (components &&
                  components[item.configKey] &&
                  isInstalled &&
                  connectors[item.configKey] &&
                  isComponentInstalled(item.name) && (
                    <ChannelCard
                      componentInfo={item}
                      channelsToShow={channelsBySource(item.source).length}
                      componentStatus={getComponentStatus(
                        isInstalled,
                        Object.keys(connectors[item.configKey]).length > 0 || item.source === Source.chatPlugin,
                        components[item.configKey]?.enabled
                      )}
                      key={item.displayName}
                    />
                  )) ||
                (channelsBySource(item.source).length > 0 && isComponentInstalled(item.name) && (
                  <div className={styles.cardContainer} key={item.displayName}>
                    <InfoCard
                      installed
                      style={InfoCardStyle.expanded}
                      componentInfo={item}
                      addChannelAction={() => {
                        navigate(CONNECTORS_CONNECTED_ROUTE + '/' + item.source);
                      }}
                    />
                  </div>
                )) ||
                (components && isComponentInstalled(item.name) && connectors && connectors[item.configKey] && (
                  <div className={styles.cardContainer} key={item.displayName}>
                    <InfoCard
                      installed={true}
                      componentStatus={getComponentStatus(
                        isInstalled,
                        Object.keys(connectors[item.configKey]).length > 0,
                        components[item?.configKey].enabled
                      )}
                      style={InfoCardStyle.normal}
                      key={item.displayName}
                      componentInfo={item}
                      addChannelAction={() => {
                        navigate(CONNECTORS_CONNECTED_ROUTE + '/' + item.source);
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
