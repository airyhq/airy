import React from 'react';
import styles from './index.module.scss';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';
import {useTranslation} from 'react-i18next';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {ComponentStatus} from 'model';
import {cyAddChannelButton} from 'handles';
import {getConnectedRouteForComponent, getNewChannelRouteForComponent} from '../../../services';
import {Connector} from 'model';

type ChannelCardProps = {
  componentInfo: Connector;
  channelsToShow?: number;
  componentStatus?: ComponentStatus;
};

export const ChannelCard = (props: ChannelCardProps) => {
  const {componentInfo, channelsToShow, componentStatus} = props;
  const {t} = useTranslation();
  const navigate = useNavigate();
  const CONFIGURATION_ROUTE = getConnectedRouteForComponent(
    componentInfo.source,
    componentInfo.isChannel,
    componentStatus !== ComponentStatus.notConfigured
  );

  const CONFIGURATION_ROUTE_NEW = getNewChannelRouteForComponent(
    componentInfo.source,
    componentInfo?.isChannel,
    componentStatus !== ComponentStatus.notConfigured
  );

  return (
    <div
      onClick={event => {
        event.stopPropagation(),
          channelsToShow > 0
            ? navigate(CONFIGURATION_ROUTE, {state: {from: 'connected'}})
            : navigate(CONFIGURATION_ROUTE_NEW, {state: {from: 'new'}});
      }}
      className={styles.container}
      data-cy={cyAddChannelButton}>
      <div className={styles.channelCard}>
        <div className={styles.logoTitleContainer}>
          {getChannelAvatar(componentInfo.source)}
          {componentInfo.displayName}
        </div>
        <div className={styles.linkContainer}>
          {componentStatus && (
            <ConfigStatusButton componentStatus={componentStatus} configurationRoute={CONFIGURATION_ROUTE} />
          )}
          <span>
            {channelsToShow} {channelsToShow === 1 ? t('channel') : t('channels')}
          </span>
          <ArrowRightIcon className={styles.arrowIcon} />
        </div>
      </div>
    </div>
  );
};
