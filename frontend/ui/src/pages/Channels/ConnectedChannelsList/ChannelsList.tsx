import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {listChannels, connectChannel, disconnectChannel} from '../../../actions/channel';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {CHANNELS_ROUTE} from './../../../routes/routes';

import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {StateModel} from './../../../reducers';
import {Channel} from 'httpclient';
import {allChannels} from './../../../selectors/channels';
import {Button} from '@airyhq/components';
import {ChannelSource} from 'httpclient';
import ChannelListItem from './ChannelListItem';
import styles from './ChannelsList.module.scss';

type ChannelsListProps = {
  channels: Channel[];
} & ConnectedProps<typeof connector> &
  RouteComponentProps<{source: string}>;

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
});

const mapDispatchToProps = {
  listChannels,
  connectChannel,
  disconnectChannel,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ChannelsList = (props: ChannelsListProps) => {
  let {channels} = props;
  const [name, setName] = useState('');
  const source = props.match.params.source;

  const filterSource = () => {
    switch (source) {
      case ChannelSource.facebook:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.facebook);
        setName('Facebook');
        break;
      case ChannelSource.google:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.google);
        setName('Google');
        break;
      case ChannelSource.twilioSMS:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.twilioSMS);
        setName('Twilio SMS');
        break;
      case ChannelSource.twilioWhatsapp:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.twilioWhatsapp);
        setName('Twilio Whatsapp');
        break;
      case ChannelSource.chatPlugin:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.chatPlugin);
        setName('Chat Plugin');
        break;
    }
    return channels;
  };

  useEffect(() => {
    filterSource();
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>{name}</h1>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>
      <div className={styles.channelsList}>
        {channels &&
          channels.map((channel: Channel) => (
            <div key={channel.id} className={styles.connectedChannel}>
              <ChannelListItem channel={channel} isConnected={channel.connected} isLastItem={false} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default withRouter(connector(ChannelsList));
