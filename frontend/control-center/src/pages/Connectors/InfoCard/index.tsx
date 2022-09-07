import React from 'react';
import {useNavigate} from 'react-router-dom';
import {installComponent, uninstallComponent} from '../../../actions/catalog';
import {connect, ConnectedProps} from 'react-redux';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {ComponentStatus} from '..';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {ConnectorCardComponentInfo} from '../index';
import {getNewChannelRouteForComponent} from '../../../services';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/uncheckIcon.svg';
import styles from './index.module.scss';
import {STATUS_ROUTE} from '../../../routes/routes';
import {Tooltip} from 'components';
import {useTranslation} from 'react-i18next';

type InfoCardProps = {
  componentInfo: ConnectorCardComponentInfo;
  componentStatus?: ComponentStatus;
  isHealthy: boolean;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  installComponent,
  uninstallComponent,
};

const connector = connect(null, mapDispatchToProps);

const InfoCard = (props: InfoCardProps) => {
  const {componentInfo, componentStatus, isHealthy} = props;
  const {t} = useTranslation();
  const navigate = useNavigate();
  const CONFIGURATION_ROUTE = getNewChannelRouteForComponent(componentInfo.source);

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    navigate(CONFIGURATION_ROUTE);
  };

  return (
    <div onClick={event => handleCardClick(event)} className={styles.container}>
      <div className={styles.infoCard}>
        <div className={styles.channelLogoTitleContainer}>
          {getChannelAvatar(componentInfo.source)}
          {componentInfo.displayName}
        </div>
        <div className={styles.tagIconContainer}>
          {componentStatus && <ConfigStatusButton componentStatus={componentStatus} />}
          {!isHealthy && (
            <Tooltip
              hoverElement={
                <UncheckedIcon
                  className={styles.unhealthyIcon}
                  onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                    event.stopPropagation(), navigate(STATUS_ROUTE);
                  }}
                />
              }
              hoverElementHeight={20}
              hoverElementWidth={20}
              tooltipContent={t('notHealthy')}
              direction="bottom"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default connector(InfoCard);
