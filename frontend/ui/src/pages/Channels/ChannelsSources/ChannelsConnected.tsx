import React from 'react';
import {Channel} from 'httpclient';
import styles from './ChannelsConnected.module.scss';

type connectedChannelsProps = {
  showConnectedChannels: boolean;
  showSumOfChannels: number;
  connected: string;
  connectedChannel: Channel[];
  placeholderImage: JSX.Element;
  extraChannel: boolean;
  displayExtraChannel: number;
  isConnected: string;
  addAChannel: JSX.Element;
  ignoreChannelId?: boolean;
};

const ChannelsConnected = (props: connectedChannelsProps) => {
  return (
    <>
      {props.showConnectedChannels && (
        <>
          <div className={styles.connectedContainer}>
            <div className={styles.connectedSum}>
              <p>
                {props.showSumOfChannels} {props.connected}
              </p>
            </div>

            <div className={styles.connectedChannel}>
              {props.connectedChannel.map((channel: Channel) => {
                // const channelName = channel.metadata.name;
                return (
                  <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                    <div className={styles.connectedChannelData}>
                      {/* {channel.metadata.imageUrl && (
                        <img src={channel.metadata.imageUrl} alt={channelName} className={styles.channelImage} />
                      )} */}

                      <div className={styles.placeholderLogo}>{props.placeholderImage} </div>

                      <div className={styles.connectedChannelName}>{channel.metadata.name}</div>

                      {!props.ignoreChannelId && <div className={styles.channelId}>{channel.sourceChannelId}</div>}
                    </div>
                  </li>
                );
              })}
              {props.extraChannel && (
                <button className={styles.extraChannel}>
                  +{props.displayExtraChannel} {props.isConnected}
                </button>
              )}
            </div>
          </div>

          <div className={styles.channelButton}>
            <button type="button" className={styles.addChannelButton}>
              <div className={styles.channelButtonIcon}>{props.addAChannel}</div>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ChannelsConnected;
