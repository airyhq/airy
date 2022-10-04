import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Connector, Source} from 'model';
import InfoCard from './InfoCard';
import {StateModel} from '../../reducers';
import {listChannels, listComponents, getConnectorsConfiguration} from '../../actions';
import {setPageTitle} from '../../services/pageTitle';
import {EmptyStateConnectors} from './EmptyStateConnectors';
import {ChannelCard} from './ChannelCard';
import {SimpleLoader} from 'components';
import {getComponentStatus} from '../../services';
import styles from './index.module.scss';
import {getMergedConnectors} from '../../selectors';

const mapDispatchToProps = {
  listChannels,
  getConnectorsConfiguration,
  listComponents,
};

const mapStateToProps = (state: StateModel) => {
  return {
    connectors: getMergedConnectors(state),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Connectors = (props: ConnectedProps<typeof connector>) => {
  const {connectors, listChannels, getConnectorsConfiguration, listComponents} = props;
  const installedConnectors = Object.values(connectors).filter(
    (connector: Connector) => connector.isInstalled && connector.source !== Source.webhooks && connector.price
  );
  const hasAvailableConnectors =
    Object.values(connectors).filter((connector: Connector) => connector.source !== Source.webhooks && connector.price)
      .length > 0;

  const hasInstalledComponents = installedConnectors.length > 0;
  const pageTitle = 'Connectors';
  const sortByName = (a: Connector, b: Connector) => a?.displayName?.localeCompare(b?.displayName);

  useEffect(() => {
    listChannels().catch((error: Error) => {
      console.error(error);
    });
    getConnectorsConfiguration().catch((error: Error) => {
      console.error(error);
    });
    listComponents().catch((error: Error) => {
      console.error(error);
    });
    setPageTitle(pageTitle);
  }, []);

  return (
    <div className={styles.channelsWrapper}>
      <div className={styles.channelsHeadline}>
        <div>
          <h1 className={styles.channelsHeadlineText}>Connectors</h1>
          {!hasAvailableConnectors && <SimpleLoader />}
        </div>
      </div>
      <div className={styles.wrapper}>
        {!hasInstalledComponents ? (
          <EmptyStateConnectors />
        ) : (
          <>
            {installedConnectors.sort(sortByName).map((connector: Connector) => {
              if (connector.isChannel) {
                return (
                  <ChannelCard
                    key={connector.name}
                    componentInfo={connector}
                    componentStatus={getComponentStatus(
                      connector.isHealthy,
                      connector.isInstalled,
                      connector.isConfigured,
                      connector.isEnabled
                    )}
                    channelsToShow={connector.connectedChannels}
                  />
                );
              }
              if (!connector.isChannel) {
                return (
                  <InfoCard
                    key={connector.name}
                    componentInfo={connector}
                    componentStatus={getComponentStatus(
                      connector.isHealthy,
                      connector.isInstalled,
                      connector.isConfigured,
                      connector.isEnabled
                    )}
                  />
                );
              }
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default connector(Connectors);
