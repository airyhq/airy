import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {listChannels, connectChannel, disconnectChannel} from '../../../actions/channel';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {CHANNELS_ROUTE} from './../../../routes/routes';

import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {ReactComponent as CheckMark} from 'assets/images/icons/checkmark.svg';
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

  const filterSource = () => {
    const source = props.match.params.source;
    switch (source) {
      case ChannelSource.facebook:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.facebook);
      case ChannelSource.google:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.google);
      case ChannelSource.twilioSMS:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.twilioSMS);
      case ChannelSource.twilioWhatsapp:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.twilioWhatsapp);
      case ChannelSource.chatPlugin:
        channels = channels.filter((channel: Channel) => channel.source === ChannelSource.chatPlugin);
    }
    return channels;
  };

  console.log(filterSource());

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>LALALLA</h1>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>
      <div className={styles.connectedChannels}>
        <p>TEEEEEST</p>
        {channels.map((channel: Channel) => {
          <div className={styles.channelRow}>
            <p>dhsajkdahskdjashdkjsahdkajshkjdsha</p>
            <img src={channel.metadata.imageUrl} />
            <p>{channel.metadata.name}</p>
            {channel.connected && (
              <div className={styles.connectedHint}>
                Connected <CheckMark />
              </div>
            )}
            <div className={styles.channelRowEdit}>
              <Button styleVariant="text">Edit</Button>
            </div>
            <br />
          </div>;
        })}
      </div>
      {/* <Button styleVariant="normal" disabled={buttonStatus()} onClick={connectChannelFacebook(connectFacebookPayload)}>
          Connect Page
        </Button> */}
    </div>
  );
};

export default withRouter(connector(ChannelsList));
