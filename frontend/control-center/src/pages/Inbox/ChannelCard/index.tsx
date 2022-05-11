import React from 'react';
import styles from './index.module.scss';
import {SourceInfo} from '../../../components/SourceInfo';
import {Link} from 'react-router-dom';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';

type ChannelCardProps = {
  sourceInfo: SourceInfo;
  channelsToShow: number;
};

export const ChannelCard = (props: ChannelCardProps) => {
  const {sourceInfo, channelsToShow} = props;
  return (
    <Link to={sourceInfo.channelsListRoute} className={styles.container}>
      <div className={styles.channelCard}>
        <div className={styles.logoTitleContainer}>
          {sourceInfo.image}
          {sourceInfo.title}
        </div>
        <div className={styles.linkContainer}>
          <span>
            {channelsToShow} {channelsToShow === 1 ? 'channel' : 'channels'}
          </span>
          <ArrowRightIcon className={styles.arrowIcon} />
        </div>
      </div>
    </Link>
  );
};
