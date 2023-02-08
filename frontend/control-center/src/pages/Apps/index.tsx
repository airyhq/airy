import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Connector, InstallationStatus, Source} from 'model';
import InfoCard from '../Connectors/InfoCard';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';
import {EmptyStateConnectors} from '../Connectors/EmptyStateConnectors';
import {ChannelCard} from '../Connectors/ChannelCard';
import {getComponentStatus} from '../../services';
import styles from './index.module.scss';
import {getMergedConnectors} from '../../selectors';
import {AiryLoader} from 'components/loaders/AiryLoader';

const mapStateToProps = (state: StateModel) => {
  return {
    apps: Object.values(getMergedConnectors(state)).filter((component: Connector) => component.isApp === true),
  };
};

const connector = connect(mapStateToProps, null);

const Apps = (props: ConnectedProps<typeof connector>) => {
  const {apps} = props;
  const installedApps = Object.values(apps).filter(
    (app: Connector) =>
      app.installationStatus === InstallationStatus.installed &&
      app.source !== Source.airyContacts &&
      app.source !== Source.airyWebhooks &&
      app.source !== Source.airyMobile &&
      app.price
  );
  const hasAvailableConnectors =
    Object.values(apps).filter(
      (connector: Connector) =>
        connector.source !== Source.airyContacts &&
        connector.source !== Source.airyMobile &&
        connector.source !== Source.airyWebhooks &&
        connector.price
    ).length > 0;

  const hasInstalledComponents = installedApps.length > 0;
  const pageTitle = 'Apps';
  const sortByName = (a: Connector, b: Connector) => a?.displayName?.localeCompare(b?.displayName);

  useEffect(() => {
    setPageTitle(pageTitle);
  }, []);

  return (
    <div className={styles.channelsWrapper}>
      <div className={styles.channelsHeadline}>
        <div>
          <h1 className={styles.channelsHeadlineText}>Apps</h1>
        </div>
      </div>
      <div className={styles.wrapper}>
        {!hasAvailableConnectors ? (
          <AiryLoader height={240} width={240} position="relative" top={220} />
        ) : !hasInstalledComponents ? (
          <EmptyStateConnectors />
        ) : (
          <>
            {installedApps.sort(sortByName).map((app: Connector) => {
              if (app.isChannel) {
                return (
                  <ChannelCard
                    key={connector.name}
                    componentInfo={app}
                    componentStatus={getComponentStatus(
                      app.isHealthy,
                      app.installationStatus === InstallationStatus.installed,
                      app.isConfigured,
                      app.isEnabled
                    )}
                    channelsToShow={app.connectedChannels}
                  />
                );
              }
              if (!app.isChannel) {
                return (
                  <InfoCard
                    key={app.name}
                    componentInfo={app}
                    componentStatus={getComponentStatus(
                      app.isHealthy,
                      app.installationStatus === InstallationStatus.installed,
                      app.isConfigured,
                      app.isEnabled
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

export default connector(Apps);
