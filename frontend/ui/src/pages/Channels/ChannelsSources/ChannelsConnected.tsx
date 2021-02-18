import React from 'react';
import {Channel} from 'httpclient';
import styles from './ChannelsConnected.module.scss';

type connectedChannelsProps = {
  showConnectedChannels: boolean;
  showSumOfChannels: number;
  connected: string;
  connectedChannel: Channel[];
  placeholderImage?: JSX.Element;
  extraChannel: boolean;
  displayExtraChannel: number;
  isConnected: string;
  addAChannel: JSX.Element;
  ignoreChannelId?: boolean;
  ignorePlaceholder?: boolean;
  displayFacebookImage?: boolean;
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
            <div className={styles.connectedChannelFlex}>
              <div className={styles.connectedChannel}>
                {props.connectedChannel.map((channel: Channel) => {
                  const channelName = channel.metadata.name;
                  return (
                    <>
                      <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                        <div className={styles.connectedChannelData}>
                          {channel.metadata.imageUrl && props.displayFacebookImage && (
                            <img src={channel.metadata.imageUrl} alt={channelName} className={styles.facebookImage} />
                          )}

                          {!props.ignorePlaceholder && (
                            <div className={styles.placeholderLogo}>{props.placeholderImage} </div>
                          )}

                          <div className={styles.connectedChannelName}>{channel.metadata.name}</div>

                          {!props.ignoreChannelId && <div className={styles.channelId}>{channel.sourceChannelId}</div>}
                        </div>
                      </li>
                      {props.displayFacebookImage && (
                        <>
                          <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                            <div className={styles.connectedChannelData}>
                              {channel.metadata.imageUrl && props.displayFacebookImage && (
                                <img
                                  src={channel.metadata.imageUrl}
                                  alt={channelName}
                                  className={styles.facebookImage}
                                />
                              )}

                              {!props.ignorePlaceholder && (
                                <div className={styles.placeholderLogo}>{props.placeholderImage} </div>
                              )}

                              <div className={styles.connectedChannelName}>{channel.metadata.name}</div>

                              {!props.ignoreChannelId && (
                                <div className={styles.channelId}>{channel.sourceChannelId}</div>
                              )}
                            </div>
                          </li>
                          <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                            <div className={styles.connectedChannelData}>
                              {channel.metadata.imageUrl && props.displayFacebookImage && (
                                <img
                                  src={channel.metadata.imageUrl}
                                  alt={channelName}
                                  className={styles.facebookImage}
                                />
                              )}

                              {!props.ignorePlaceholder && (
                                <div className={styles.placeholderLogo}>{props.placeholderImage} </div>
                              )}

                              <div className={styles.connectedChannelName}>{channel.metadata.name}</div>

                              {!props.ignoreChannelId && (
                                <div className={styles.channelId}>{channel.sourceChannelId}</div>
                              )}
                            </div>
                          </li>
                          <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                            <div className={styles.connectedChannelData}>
                              {channel.metadata.imageUrl && props.displayFacebookImage && (
                                <img
                                  src={channel.metadata.imageUrl}
                                  alt={channelName}
                                  className={styles.facebookImage}
                                />
                              )}

                              {!props.ignorePlaceholder && (
                                <div className={styles.placeholderLogo}>{props.placeholderImage} </div>
                              )}

                              <div className={styles.connectedChannelName}>{channel.metadata.name}</div>

                              {!props.ignoreChannelId && (
                                <div className={styles.channelId}>{channel.sourceChannelId}</div>
                              )}
                            </div>
                          </li>
                        </>
                      )}
                    </>
                  );
                })}
              </div>
              <div className={styles.extraChannelButton}>
                {props.extraChannel && (
                  <button className={styles.extraChannel}>
                    +{props.displayExtraChannel} {props.isConnected}
                  </button>
                )}
              </div>
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
