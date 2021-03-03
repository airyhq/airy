import React from 'react';
import {Channel} from 'httpclient';
import {LinkButton} from '@airyhq/components';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import styles from './index.module.scss';

type SourceInfoProps = {
  source: string;
  channels: Channel[];
  connected: string;
  placeholderImage?: JSX.Element;
  isConnected: string;
  onAddChannelClick?: () => void;
  onSourceInfoClick?: () => void;
  onMoreChannelsClick?: () => void;
  onChannelClick?: (channel: Channel) => void;
};

const SourceInfo = (props: SourceInfoProps) => {
  const {source, channels} = props;

  const isPhoneNumberSource = () => {
    return source === 'twilio.sms' || source === 'twilio.whatsapp';
  };

  const channelsToShow = isPhoneNumberSource() ? 2 : 4;
  const hasExtraChannels = channels.length > channelsToShow;

  return (
    <>
      {channels && channels.length > 0 && (
        <>
          <div className={styles.connectedContainer}>
            <div className={styles.connectedSum}>
              <p>
                {channels.length} {props.connected}
              </p>
            </div>
            <div className={styles.connectedChannelBox} onClick={() => props.onSourceInfoClick()}>
              <div className={styles.connectedChannel}>
                {channels.slice(0, channelsToShow).map((channel: Channel) => {
                  return (
                    <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                      <button className={styles.connectedChannelData} onClick={() => props.onChannelClick(channel)}>
                        {channel.metadata?.imageUrl ? (
                          <img
                            src={channel.metadata?.imageUrl}
                            alt={channel.metadata?.name}
                            className={styles.facebookImage}
                          />
                        ) : (
                          <div className={styles.placeholderLogo}>{props.placeholderImage} </div>
                        )}
                        <div className={styles.connectedChannelName}>{channel.metadata?.name}</div>
                        {isPhoneNumberSource() && (
                          <div className={styles.extraPhoneInfo}>{channel.sourceChannelId}</div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </div>
              <div className={styles.extraChannel}>
                {hasExtraChannels && (
                  <LinkButton onClick={props.onMoreChannelsClick}>
                    +{channels.length - channelsToShow} {props.isConnected}
                  </LinkButton>
                )}
              </div>
            </div>
          </div>

          <div className={styles.channelButton}>
            <button type="button" className={styles.addChannelButton} onClick={() => props.onAddChannelClick()}>
              <div className={styles.channelButtonIcon} title="Add a channel">
                <AddChannel />
              </div>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SourceInfo;
