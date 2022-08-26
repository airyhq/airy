import React from 'react';
import {useNavigate} from 'react-router-dom';
import {installComponent, uninstallComponent} from '../../../actions/catalog';
import {connect, ConnectedProps} from 'react-redux';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {ComponentStatus} from '..';
import {getNewChannelRouteForComponent} from '../../../services/getRouteForCard';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {ConnectorCardComponentInfo} from '../index';
import styles from './index.module.scss';

type InfoCardProps = {
  componentInfo: ConnectorCardComponentInfo;
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

  const handleCardClick = () => {
    navigate(getNewChannelRouteForComponent(componentInfo.displayName));
  };

  return (
    <div onClick={handleCardClick} className={styles.container}>
      <div className={styles.infoCard}>
        <div className={styles.channelLogoTitleContainer}>
          {getChannelAvatar(componentInfo.source)}
          {componentInfo.displayName}
        </div>
        {componentStatus && <ConfigStatusButton componentStatus={componentStatus} />}
      </div>
    </div>
  );
};

export default connector(InfoCard);
