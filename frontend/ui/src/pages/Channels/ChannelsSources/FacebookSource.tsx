import React from 'react';
import styles from './FacebookSource.module.scss';
import {ReactComponent as FacebookLogo} from '../../../assets/images/icons/messenger_avatar.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';

type facebookSourceProps = {facebookSource: Channel[]};

const FacebookSource = (props: facebookSourceProps) => {
  const facebookSources = props.facebookSource.filter(channel => channel.source === 'facebook').slice(0, 4);
  const facebookSourcesExtra = props.facebookSource.filter(channel => channel.source === 'facebook').slice(4);
  const totalFacebookSources = facebookSources.concat(facebookSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <div className={styles.facebookChannel}>
        <div className={styles.facebookLogo}>
          <FacebookLogo />
        </div>
        <div className={styles.facebookTitleAndText}>
          <p className={styles.facebookTitle}>Messenger</p>
          <p className={styles.facebookText}>Connect multiple Facebook pages</p>
        </div>
      </div>
      {facebookSources.length === 0 && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton}>
            <div className={styles.channelButtonIcon}>
              <AddChannel />
            </div>
          </button>
        </div>
      )}

      {facebookSources.length > 0 && (
        <>
          <div className={styles.facebookConnectedContainer}>
            <div className={styles.facebookConnectedSum}>
              <p>{totalFacebookSources.length} CONNECTED</p>
            </div>

            <div className={styles.facebookConnectedChannel}>
              {facebookSources.map((channel: Channel) => {
                const channelName = channel.metadata.name;
                return (
                  <li key={channel.sourceChannelId} className={styles.facebookListEntry}>
                    <div className={styles.connectedChannelData}>
                      {channel.metadata.imageUrl && (
                        <img src={channel.metadata.imageUrl} alt={channelName} className={styles.facebookImage} />
                      )}

                      <div className={styles.facebookName}>{channel.metadata.name}</div>
                    </div>
                  </li>
                );
              })}
              {facebookSourcesExtra.length > 0 && (
                <button className={styles.facebookExtraChannel}>+{facebookSourcesExtra.length} connected</button>
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

export default FacebookSource;
