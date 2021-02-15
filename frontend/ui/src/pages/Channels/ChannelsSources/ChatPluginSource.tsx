import React from 'react';
import styles from './ChatPluginSource.module.scss';
import {ReactComponent as AiryLogo} from '../../../assets/images/icons/airy_avatar.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../../assets/images/icons/placeholder.svg';
import {Channel} from 'httpclient';

type chatPluginProps = {pluginSource: Channel[]};

const ChatPluginSource = (props: chatPluginProps) => {
  const chatPluginSources = props.pluginSource.filter(channel => channel.source === 'chat_plugin').slice(0, 4);
  const chatPluginSourcesExtra = props.pluginSource.filter(channel => channel.source === 'chat_plugin').slice(4);
  const totalChatPluginSources = chatPluginSources.concat(chatPluginSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <div className={styles.airyChannel}>
        <div className={styles.airyLogo}>
          <AiryLogo />
        </div>
        <div className={styles.airyTitleAndText}>
          <p className={styles.airyTitle}>Airy Live Chat</p>
          <p className={styles.airyText}>Best of class browser messenger</p>
        </div>
      </div>
      {chatPluginSources.length === 0 && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton}>
            <div className={styles.channelButtonIcon}>
              <AddChannel />
            </div>
          </button>
        </div>
      )}

      {chatPluginSources.length > 0 && (
        <>
          <div className={styles.airyConnectedContainer}>
            <div className={styles.airyConnectedSum}>
              <p>{totalChatPluginSources.length} CONNECTED</p>
            </div>

            <div className={styles.airyConnectedChannel}>
              {chatPluginSources.map((channel: Channel) => {
                const channelName = channel.metadata.name;
                return (
                  <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                    <div className={styles.connectedChannelData}>
                      {channel.metadata.imageUrl && (
                        <img src={channel.metadata.imageUrl} alt={channelName} className={styles.channelImage} />
                      )}

                      <div className={styles.placeholderLogo}>
                        <Placeholder />{' '}
                      </div>

                      <div className={styles.channelName}>{channel.metadata.name}</div>
                    </div>
                  </li>
                );
              })}
              {chatPluginSourcesExtra.length > 0 && (
                <button className={styles.extraChannel}>+{chatPluginSourcesExtra.length} connected</button>
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

export default ChatPluginSource;
