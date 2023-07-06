import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Connector, InstallationStatus, Source} from 'model';
import InfoCard from './InfoCard';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';
import {EmptyStateConnectors} from './EmptyStateConnectors';
import {ChannelCard} from './ChannelCard';
import {getComponentStatus} from '../../services';
import styles from './index.module.scss';
import {getMergedConnectors} from '../../selectors';
import {AiryLoader} from 'components/loaders/AiryLoader';

const mapStateToProps = (state: StateModel) => {
  return {
    connectors: Object.values(getMergedConnectors(state)).filter((component: Connector) => component.isApp !== true),
  };
};

const connector = connect(mapStateToProps, null);

const Connectors = (props: ConnectedProps<typeof connector>) => {
  const {connectors} = props;
  const installedConnectors = Object.values(connectors).filter(
    (connector: Connector) =>
      connector.installationStatus === InstallationStatus.installed &&
      connector.source !== Source.airyContacts &&
      connector.source !== Source.airyWebhooks &&
      connector.source !== Source.airyMobile &&
      connector.source !== Source.integrationSourceApi &&
      connector.price
  );
  const hasAvailableConnectors =
    Object.values(connectors).filter(
      (connector: Connector) =>
        connector.source !== Source.airyContacts &&
        connector.source !== Source.airyMobile &&
        connector.source !== Source.airyWebhooks &&
        connector.source !== Source.integrationSourceApi &&
        connector.price
    ).length > 0;

  const hasInstalledComponents = installedConnectors.length > 0;
  const pageTitle = 'Connectors';
  const sortByName = (a: Connector, b: Connector) => a?.displayName?.localeCompare(b?.displayName);

  useEffect(() => {
    setPageTitle(pageTitle);
  }, []);

  return (
    <div className={styles.channelsWrapper}>
      <div className={styles.channelsHeadline}>
        <div>
          <h1 className={styles.channelsHeadlineText}>Connectors</h1>
        </div>
      </div>
      <div className={styles.wrapper}>
        {!hasAvailableConnectors ? (
          <AiryLoader height={240} width={240} position="relative" top={220} />
        ) : !hasInstalledComponents ? (
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
                      connector.installationStatus === InstallationStatus.installed,
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
                      connector.installationStatus === InstallationStatus.installed,
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
