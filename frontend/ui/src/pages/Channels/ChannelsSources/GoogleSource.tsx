import React from 'react';
import styles from './GoogleSource.module.scss';
import {ReactComponent as GoogleLogo} from '../../../assets/images/icons/google_avatar.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../../assets/images/icons/placeholder.svg';
import {Channel} from 'httpclient';

type googleSourceProps = {googleSource: Channel[]};

const GoogleSource = (props: googleSourceProps) => {
  const googleSources = props.googleSource.filter(channel => channel.source === 'google').slice(0, 2);
  const googleSourcesExtra = props.googleSource.filter(channel => channel.source === 'google').slice(2);
  const totalGoogleSources = googleSources.concat(googleSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <div className={styles.googleChannel}>
        <div className={styles.googleLogo}>
          <GoogleLogo />
        </div>
        <div className={styles.googleTitleAndText}>
          <p className={styles.googleTitle}>Google Business Messages</p>
          <p className={styles.googleText}>Be there when people search</p>
        </div>
      </div>
      {googleSources.length === 0 && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton}>
            <div className={styles.channelButtonIcon}>
              <AddChannel />
            </div>
          </button>
        </div>
      )}

      {googleSources.length > 0 && (
        <>
          <div className={styles.googleConnectedContainer}>
            <div className={styles.googleConnectedSum}>
              <p>{totalGoogleSources.length} CONNECTED</p>
            </div>

            <div className={styles.googleConnectedChannel}>
              {googleSources.map((channel: Channel) => {
                const channelName = channel.metadata.name;
                return (
                  <li key={channel.sourceChannelId} className={styles.googleListEntry}>
                    <div className={styles.connectedChannelData}>
                      {channel.metadata.imageUrl && (
                        <img src={channel.metadata.imageUrl} alt={channelName} className={styles.channelImage} />
                      )}

                      <div className={styles.placeholderLogo}>
                        <Placeholder />{' '}
                      </div>

                      <div className={styles.googleName}>{channel.metadata.name}</div>
                      <div className={styles.googleId}>{channel.sourceChannelId}</div>
                    </div>
                  </li>
                );
              })}
              {googleSourcesExtra.length > 0 && (
                <button className={styles.googleExtraChannel}>+{googleSourcesExtra.length} connected</button>
              )}
            </div>
          </div>

          <div className={styles.channelButton}>
            <button type="button" className={styles.addChannelButton}>
              <div className={styles.channelButtonIcon}>
                <AddChannel />
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleSource;
