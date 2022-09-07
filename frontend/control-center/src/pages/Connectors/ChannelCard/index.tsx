import React from 'react';
import styles from './index.module.scss';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';
import {CONNECTORS_ROUTE, STATUS_ROUTE} from '../../../routes/routes';
import {useTranslation} from 'react-i18next';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {ComponentStatus, ConnectorCardComponentInfo} from '..';
import {cyAddChannelButton} from 'handles';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/uncheckIcon.svg';
import {Tooltip} from 'components';

type ChannelCardProps = {
  componentInfo: ConnectorCardComponentInfo;
  channelsToShow?: number;
  componentStatus?: ComponentStatus;
  isHealthy?: boolean;
};

export const ChannelCard = (props: ChannelCardProps) => {
  const {componentInfo, channelsToShow, componentStatus, isHealthy} = props;
  const {t} = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      onClick={event => {
        event.stopPropagation(), navigate(CONNECTORS_ROUTE + '/' + componentInfo.source + '/connected');
      }}
      className={styles.container}
      data-cy={cyAddChannelButton}
    >
      <div className={styles.channelCard}>
        <div className={styles.logoTitleContainer}>
          {getChannelAvatar(componentInfo.source)}
          {componentInfo.displayName}
        </div>
        <div className={styles.tagLinkIconContainer}>
          <div className={styles.tagIconContainer}>
            <div className={styles.linkContainer}>
              {componentStatus && <ConfigStatusButton componentStatus={componentStatus} />}
              <span>
                {channelsToShow} {channelsToShow === 1 ? t('channel') : t('channels')}
              </span>
              <ArrowRightIcon className={styles.arrowIcon} />
            </div>
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
    </div>
  );
};
