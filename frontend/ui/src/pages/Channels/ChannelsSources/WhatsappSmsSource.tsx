import React from 'react';
import styles from './WhatsappSmsSource.module.scss';
import {ReactComponent as WhatsappLogo} from '../../../assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../../assets/images/icons/placeholder.svg';
import {Channel} from 'httpclient';

type whatsappSourceProps = {whatsappSmsSource: Channel[]};

const WhatsappSmsSource = (props: whatsappSourceProps) => {
  const whatsappSources = props.whatsappSmsSource.filter(channel => channel.source === 'twilio.whatsapp').slice(0, 2);
  const whatsappSourcesExtra = props.whatsappSmsSource.filter(channel => channel.source === 'twilio.whatsapp').slice(2);
  const totalWhatsappSources = whatsappSources.concat(whatsappSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <div className={styles.whatsappChannel}>
        <div className={styles.whatsappLogo}>
          <WhatsappLogo />
        </div>
        <div className={styles.whatsappTitleAndText}>
          <p className={styles.whatsappTitle}>Whatsapp</p>
          <p className={styles.whatsappText}>World #1 chat app</p>
        </div>
      </div>
      {whatsappSources.length === 0 && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton}>
            <div className={styles.channelButtonIcon}>
              <AddChannel />
            </div>
          </button>
        </div>
      )}

      {whatsappSources.length > 0 && (
        <>
          <div className={styles.whatsappConnectedContainer}>
            <div className={styles.whatsappConnectedSum}>
              <p>{totalWhatsappSources.length} CONNECTED</p>
            </div>

            <div className={styles.whatsappConnectedChannel}>
              {whatsappSources.map((channel: Channel) => {
                // const channelName = channel.metadata.name;
                return (
                  <li key={channel.sourceChannelId} className={styles.whatsappListEntry}>
                    <div className={styles.connectedChannelData}>
                      {/* {channel.metadata.imageUrl && (
                        <img src={channel.metadata.imageUrl} alt={channelName} className={styles.channelImage} />
                      )} */}

                      <div className={styles.placeholderLogo}>
                        <Placeholder />{' '}
                      </div>

                      <div className={styles.whatsappName}>{channel.metadata.name}</div>
                      <div className={styles.whatsappId}>{channel.sourceChannelId}</div>
                    </div>
                  </li>
                );
              })}
              {whatsappSourcesExtra.length > 0 && (
                <button className={styles.whatsappExtraChannel}>+{whatsappSourcesExtra.length} connected</button>
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

export default WhatsappSmsSource;
