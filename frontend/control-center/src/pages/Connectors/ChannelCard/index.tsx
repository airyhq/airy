import React from 'react';
import styles from './index.module.scss';
import {SourceInfo} from '../../../components/SourceInfo';
import {Link} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';
import {useTranslation} from 'react-i18next';
import {ConfigStatusButton} from '../ConfigStatusButton';
import {ComponentStatus} from '..';

type ChannelCardProps = {
  sourceInfo: SourceInfo;
  channelsToShow?: number;
  componentStatus?: ComponentStatus;
};

export const ChannelCard = (props: ChannelCardProps) => {
  const {sourceInfo, channelsToShow, componentStatus} = props;
  const {t} = useTranslation();

  return (
    <Link to={sourceInfo.channelsListRoute} className={styles.container} data-cy={sourceInfo.dataCyAddChannelButton}>
      <div className={styles.channelCard}>
        <div className={styles.logoTitleContainer}>
          {sourceInfo.image}
          {sourceInfo.title}
        </div>
        <div className={styles.linkContainer}>
          {componentStatus && <ConfigStatusButton componentStatus={componentStatus} />}
          <span>
            {channelsToShow} {channelsToShow === 1 ? t('channel') : t('channels')}
          </span>
          <ArrowRightIcon className={styles.arrowIcon} />
        </div>
      </div>
    </Link>
  );
};
