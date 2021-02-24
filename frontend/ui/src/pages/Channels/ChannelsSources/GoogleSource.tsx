import React from 'react';
import styles from './ChannelDetails.module.scss';
import {ReactComponent as GoogleLogo} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';
import {ChannelSource} from './ChannelSourceModel';

type googleSourceProps = {googleSource: Channel[]};

const GoogleSource = (props: googleSourceProps) => {
  const googleSources = props.googleSource.filter(channel => channel.source === 'google').slice(0, 2);
  const googleSourcesExtra = props.googleSource.filter(channel => channel.source === 'google').slice(2);
  const totalGoogleSources = googleSources.concat(googleSourcesExtra);

  const connectedAttributes = {
    showConnectedChannels: googleSources.length > 0,
    connectedChannel: googleSources,
    showSumOfChannels: totalGoogleSources.length,
  };

  const connectedAttributesExtra = {
    extraChannel: googleSourcesExtra.length > 0,
    displayExtraChannel: googleSourcesExtra.length,
  };

  return (
    <div className={styles.flexWrap}>
      <ChannelDetails
        title="Google Business Messages"
        text="Be there when people search"
        image={<GoogleLogo />}
        buttonIcon={<AddChannel />}
        displayButton={googleSources.length === 0}
        id={ChannelSource.google}
      />

      <ChannelsConnected
        {...connectedAttributes}
        {...connectedAttributesExtra}
        connected="CONNECTED"
        placeholderImage={<GoogleLogo />}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default GoogleSource;
