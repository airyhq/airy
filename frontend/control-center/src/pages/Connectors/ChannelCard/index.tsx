import React from 'react';
import styles from './index.module.scss';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';
import {useTranslation} from 'react-i18next';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {ComponentStatus} from 'model';
import {cyAddChannelButton} from 'handles';
import {getConnectedRouteForComponent} from '../../../services';
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
  const route = getConnectedRouteForComponent(
    componentInfo.source,
    componentInfo.isChannel,
    componentInfo.connectedChannels > 0,
    componentInfo.isConfigured
  );

  return (
    <div
      onClick={event => {
        event.stopPropagation(), navigate(route);
      }}
      className={styles.container}
      data-cy={cyAddChannelButton}
    >
      <div className={styles.channelCard}>
        <div className={styles.logoTitleContainer}>
          {getChannelAvatar(componentInfo.source)}
          {componentInfo.displayName}
        </div>
        <div className={styles.linkContainer}>
          {componentStatus && <ConfigStatusButton componentStatus={componentStatus} configurationRoute={route} />}
          <span>
            {channelsToShow} {channelsToShow === 1 ? t('channel') : t('channels')}
          </span>
          <ArrowRightIcon className={styles.arrowIcon} />
        </div>
      </div>
    </div>
  );
};
