import React from 'react';
import styles from './TwilloSmsSource.module.scss';
import {ReactComponent as SMSLogo} from '../../../assets/images/icons/sms_avatar.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../../assets/images/icons/placeholder.svg';
import {Channel} from 'httpclient';

type twilloSmsSourceProps = {twilloSmsSource: Channel[]};

const TwilloSmsSource = (props: twilloSmsSourceProps) => {
  const twilloSources = props.twilloSmsSource.filter(channel => channel.source === 'twilio.sms').slice(0, 2);
  const twilloSourcesExtra = props.twilloSmsSource.filter(channel => channel.source === 'twilio.sms').slice(2);
  const totalTwilloSources = twilloSources.concat(twilloSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <div className={styles.smsChannel}>
        <div className={styles.smsLogo}>
          <SMSLogo />
        </div>
        <div className={styles.smsTitleAndText}>
          <p className={styles.smsTitle}>SMS</p>
          <p className={styles.smsText}>Deliver SMS with ease</p>
        </div>
      </div>
      {twilloSources.length === 0 && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton}>
            <div className={styles.channelButtonIcon}>
              <AddChannel />
            </div>
          </button>
        </div>
      )}

      {twilloSources.length > 0 && (
        <>
          <div className={styles.twilloConnectedContainer}>
            <div className={styles.twilloConnectedSum}>
              <p>{totalTwilloSources.length} CONNECTED</p>
            </div>

            <div className={styles.twilloConnectedChannel}>
              {twilloSources.map((channel: Channel) => {
                // const channelName = channel.metadata.name;
                return (
                  <li key={channel.sourceChannelId} className={styles.twilloListEntry}>
                    <div className={styles.connectedChannelData}>
                      {/* {channel.metadata.imageUrl && (
                        <img src={channel.metadata.imageUrl} alt={channelName} className={styles.channelImage} />
                      )} */}

                      <div className={styles.placeholderLogo}>
                        <Placeholder />{' '}
                      </div>

                      <div className={styles.twilloName}>{channel.metadata.name}</div>
                      <div className={styles.twilloId}>{channel.sourceChannelId}</div>
                    </div>
                  </li>
                );
              })}
              {twilloSourcesExtra.length > 0 && (
                <button className={styles.twilloExtraChannel}>+{twilloSourcesExtra.length} connected</button>
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

export default TwilloSmsSource;
