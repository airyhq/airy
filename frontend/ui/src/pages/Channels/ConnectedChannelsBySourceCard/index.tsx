import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {LinkButton} from '@airyhq/components';
import {Channel, Source} from 'httpclient';
import {SourceInfo} from '../MainPage';
import {fallbackImage} from '../../../services/image/index';
import {ReactComponent as PlusCircleIcon} from 'assets/images/icons/plus-circle.svg';

import styles from './index.module.scss';

type ConnectedChannelsBySourceCardProps = {
  SourceInfo: SourceInfo;
  channels: Channel[];
  connected: string;
  dataCyAddChannelButton?: string;
  dataCyChannelList?: string;
};

const ConnectedChannelsBySourceCard = (props: ConnectedChannelsBySourceCardProps & RouteComponentProps) => {
  const {SourceInfo, channels, dataCyChannelList, dataCyAddChannelButton} = props;

  const hasExtraChannels = channels.length > SourceInfo.channelsToShow;

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
            <div
              className={styles.connectedChannelBox}
              onClick={() => props.history.push(SourceInfo.channelsListRoute)}>
              <div className={styles.connectedChannel} data-cy={dataCyChannelList}>
                {channels.slice(0, SourceInfo.channelsToShow).map((channel: Channel) => {
                  return (
                    <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                      <button className={styles.connectedChannelData}>
                        {SourceInfo.type === Source.facebook && channel.metadata?.imageUrl ? (
                          <img
                            src={channel.metadata?.imageUrl}
                            alt={channel.metadata?.name}
                            className={styles.facebookImage}
                            onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              fallbackImage(event, channel.source);
                            }}
                          />
                        ) : (
                          <div className={styles.placeholderLogo}>{SourceInfo.image} </div>
                        )}
                        <div className={styles.connectedChannelName}>{channel.metadata?.name}</div>
                        {SourceInfo.channelsToShow === 2 && (
                          <div className={styles.extraPhoneInfo}>{channel.sourceChannelId}</div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </div>
              <div className={styles.extraChannel}>
                {hasExtraChannels && (
                  <LinkButton>
                    +{channels.length - SourceInfo.channelsToShow} {SourceInfo.itemInfoString}
                  </LinkButton>
                )}
              </div>
            </div>
          </div>

          <div className={styles.channelButton}>
            <button
              type="button"
              className={styles.addChannelButton}
              onClick={() => props.history.push(SourceInfo.newChannelRoute)}
              data-cy={dataCyAddChannelButton}>
              <div className={styles.channelButtonIcon} title="Add a channel">
                <PlusCircleIcon />
              </div>
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default withRouter(ConnectedChannelsBySourceCard);
