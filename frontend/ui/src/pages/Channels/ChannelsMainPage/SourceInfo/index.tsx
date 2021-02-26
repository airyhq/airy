import React from 'react';
import {Channel} from 'httpclient';
import {LinkButton} from '@airyhq/components';
import styles from './index.module.scss';

type SourceInfoProps = {
  source: string;
  channels: Channel[];
  connected: string;
  placeholderImage?: JSX.Element;
  isConnected: string;
  addAChannel: JSX.Element;
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
            <div className={styles.connectedChannelBox}>
              <div className={styles.connectedChannel}>
                {channels.slice(0, channelsToShow).map((channel: Channel) => {
                  return (
                    <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                      <div className={styles.connectedChannelData}>
                        {source === 'facebook' && channel.metadata.imageUrl ? (
                          <img
                            src={channel.metadata.imageUrl}
                            alt={channel.metadata.name}
                            className={styles.facebookImage}
                          />
                        ) : (
                          <div className={styles.placeholderLogo}>{props.placeholderImage} </div>
                        )}
                        <div className={styles.connectedChannelName}>{channel.metadata.name}</div>
                        {isPhoneNumberSource() && (
                          <div className={styles.extraPhoneInfo}>{channel.sourceChannelId}</div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </div>
              <div className={styles.extraChannel}>
                {hasExtraChannels && (
                  <LinkButton>
                    +{channels.length - channelsToShow} {props.isConnected}
                  </LinkButton>
                )}
              </div>
            </div>
          </div>

          <div className={styles.channelButton}>
            <button type="button" className={styles.addChannelButton}>
              <div className={styles.channelButtonIcon} title="Add a channel">
                {props.addAChannel}
              </div>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SourceInfo;
