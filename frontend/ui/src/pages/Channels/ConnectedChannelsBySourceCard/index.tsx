import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {LinkButton} from 'components';
import {Channel} from 'model';
import {SourceInfo} from '../MainPage';
import ChannelAvatar from '../../../components/ChannelAvatar';
import {ReactComponent as PlusCircleIcon} from 'assets/images/icons/plus-circle.svg';

import styles from './index.module.scss';

type ConnectedChannelsBySourceCardProps = {
  sourceInfo: SourceInfo;
  channels: Channel[];
};

const ConnectedChannelsBySourceCard = (props: ConnectedChannelsBySourceCardProps & RouteComponentProps) => {
  const {sourceInfo, channels} = props;

  const hasExtraChannels = channels.length > sourceInfo.channelsToShow;

  return (
    <>
      {channels && channels.length > 0 && (
        <>
          <div className={styles.connectedContainer}>
            <div className={styles.connectedSum}>
              <p>{channels.length} Connected</p>
            </div>
            <div
              className={styles.connectedChannelBox}
              onClick={() => props.history.push(sourceInfo.channelsListRoute)}
            >
              <div className={styles.connectedChannel} data-cy={sourceInfo.dataCyChannelList}>
                {channels.slice(0, sourceInfo.channelsToShow).map((channel: Channel) => {
                  return (
                    <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                      <button className={styles.connectedChannelData}>
                        <ChannelAvatar channel={channel} style={{width: '20px', height: '20px', marginRight: '4px'}} />
                        <div className={styles.connectedChannelName}>
                          {channel.metadata?.name ||
                            (channel.source !== 'twilio.sms' && channel.source !== 'twilio.whatsapp'
                              ? channel.source
                              : '')}
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
              onClick={() => props.history.push(sourceInfo.newChannelRoute)}
              data-cy={sourceInfo.dataCyAddChannelButton}
            >
              <div className={styles.channelButtonIcon} title="Add a channel">
                <PlusCircleIcon />
              </div>
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default withRouter(ConnectedChannelsBySourceCard);
