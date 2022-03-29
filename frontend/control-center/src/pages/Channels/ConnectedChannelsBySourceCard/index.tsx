import React from 'react';

import {LinkButton} from 'components';
import {Channel} from 'model';
import {SourceInfo} from '../MainPage';
import ChannelAvatar from '../../../components/ChannelAvatar';
import {ReactComponent as PlusCircleIcon} from 'assets/images/icons/plusCircle.svg';

import styles from './index.module.scss';
import {useNavigate} from 'react-router-dom';

type ConnectedChannelsBySourceCardProps = {
  sourceInfo: SourceInfo;
  channels: Channel[];
};

const ConnectedChannelsBySourceCard = (props: ConnectedChannelsBySourceCardProps) => {
  const {sourceInfo, channels} = props;
  const navigate = useNavigate();

  const hasExtraChannels = channels.length > sourceInfo.channelsToShow;

  if (channels.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.connectedContainer}>
        <div className={styles.connectedSum}>
          <p>{channels.length} Connected</p>
        </div>
        <div className={styles.connectedChannelBox} onClick={() => navigate(sourceInfo.channelsListRoute)}>
          <div className={styles.connectedChannel} data-cy={sourceInfo.dataCyChannelList}>
            {channels.slice(0, sourceInfo.channelsToShow).map((channel: Channel) => {
              return (
                <li key={channel.id} className={styles.channelListEntry}>
                  <button className={styles.connectedChannelData}>
                    <ChannelAvatar channel={channel} style={{width: '20px', height: '20px', marginRight: '4px'}} />
                    <div className={styles.connectedChannelName}>
                      {channel.metadata?.name ||
                        (channel.source !== 'twilio.sms' && channel.source !== 'twilio.whatsapp' ? channel.source : '')}
                    </div>
                    {sourceInfo.channelsToShow === 2 && (
                      <div className={styles.extraPhoneInfo}>{channel.sourceChannelId}</div>
                    )}
                  </button>
                </li>
              );
            })}
          </div>
          <div className={styles.extraChannel}>
            {hasExtraChannels && (
              <LinkButton>
                +{channels.length - sourceInfo.channelsToShow} {sourceInfo.itemInfoString}
              </LinkButton>
            )}
          </div>
        </div>
      </div>

      <div className={styles.channelButton}>
        <button
          type="button"
          className={styles.addChannelButton}
          onClick={() => navigate(sourceInfo.newChannelRoute)}
          data-cy={sourceInfo.dataCyAddChannelButton}
        >
          <div className={styles.channelButtonIcon} title="Add a channel">
            <PlusCircleIcon />
          </div>
        </button>
      </div>
    </>
  );
};

export default ConnectedChannelsBySourceCard;
