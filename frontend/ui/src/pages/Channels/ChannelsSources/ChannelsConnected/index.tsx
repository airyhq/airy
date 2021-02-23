import React from 'react';
import {Channel} from 'httpclient';
import {LinkButton} from '@airyhq/components';
import styles from './index.module.scss';

type connectedChannelsProps = {  
  source: string;
  channels: Channel[];
  connected: string;  
  placeholderImage?: JSX.Element;    
  isConnected: string;
  addAChannel: JSX.Element;  
};

const ChannelsConnected = (props: connectedChannelsProps) => {

  const {source, channels} = props;

  const filteredChannels = channels.filter((channel: Channel) => channel.source === source);
  const isPhoneNumberSource = () => { return source === "twilio.sms" || source === "twilio.whatsapp" };

  const channelsToShow =  isPhoneNumberSource() ? 2 : 4;
  const hasExtraChannels = filteredChannels.length > channelsToShow;

  return (
    <>
      {filteredChannels && filteredChannels.length > 0 && (
        <>
          <div className={styles.connectedContainer}>
            <div className={styles.connectedSum}>
              <p>
                {filteredChannels.length} {props.connected}
              </p>
            </div>
            <div className={styles.connectedChannelBox}>
              <div className={styles.connectedChannel}>
                {filteredChannels.slice(0, channelsToShow).map((channel: Channel) => {
                  return (                    
                    <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                      <div className={styles.connectedChannelData}>
                        {source === "facebook" && channel.metadata.imageUrl ? (
                          <img
                            src={channel.metadata.imageUrl}
                            alt={channel.metadata.name}
                            className={styles.facebookImage}
                          />
                        ):(
                          <div className={styles.placeholderLogo}>{props.placeholderImage} </div>
                        )}
                        <div className={styles.connectedChannelName}>{channel.metadata.name}</div>
                        {isPhoneNumberSource() && <div className={styles.extraPhoneInfo}>{channel.sourceChannelId}</div>}
                      </div>
                    </li>                  
                  );
                })}
              </div>
              <div className={styles.extraChannel}>
                {hasExtraChannels && (
                  <LinkButton>
                    +{filteredChannels.length - channelsToShow} {props.isConnected}
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

export default ChannelsConnected;
