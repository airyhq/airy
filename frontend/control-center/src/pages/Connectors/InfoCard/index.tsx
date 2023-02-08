import React from 'react';
import {useNavigate} from 'react-router-dom';
import {installComponent, uninstallComponent} from '../../../actions/catalog';
import {connect, ConnectedProps} from 'react-redux';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {ComponentStatus} from 'model';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {getNewChannelRouteForComponent} from '../../../services';
import styles from './index.module.scss';
import {Connector} from 'model';

type InfoCardProps = {
  componentInfo: Connector;
  componentStatus?: ComponentStatus;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  installComponent,
  uninstallComponent,
};

const connector = connect(null, mapDispatchToProps);

const InfoCard = (props: InfoCardProps) => {
  const {componentInfo, componentStatus} = props;
  const navigate = useNavigate();
  const CONFIGURATION_ROUTE = getNewChannelRouteForComponent(
    componentInfo.source,
    componentInfo.isChannel,
    componentInfo.isApp
  );

  const handleCardClick = () => {
    navigate(CONFIGURATION_ROUTE);
  };

  return (
    <div onClick={handleCardClick} className={styles.container}>
      <div className={styles.infoCard}>
        {componentInfo.internalUI && (
          <div className={styles.externalLink}>
            <a href={componentInfo.internalUI} target="_blank" rel="noreferrer">
              Open
            </a>
          </div>
        )}
        <div className={styles.channelLogoTitleContainer}>
          {getChannelAvatar(componentInfo.source)}
          {componentInfo.displayName}
        </div>
        {componentStatus && (
          <ConfigStatusButton componentStatus={componentStatus} configurationRoute={CONFIGURATION_ROUTE} />
        )}
      </div>
    </div>
  );
};

export default connector(InfoCard);
