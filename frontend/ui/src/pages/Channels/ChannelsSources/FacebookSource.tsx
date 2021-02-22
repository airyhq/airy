import React from 'react';
import styles from './ChannelDetails.module.scss';
import {ReactComponent as FacebookLogo} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type facebookSourceProps = {facebookSource: Channel[]};

const FacebookSource = (props: facebookSourceProps) => {
  const facebookSources = props.facebookSource.filter(channel => channel.source === 'facebook').slice(0, 4);
  const facebookSourcesExtra = props.facebookSource.filter(channel => channel.source === 'facebook').slice(4);
  const totalFacebookSources = facebookSources.concat(facebookSourcesExtra);

  const connectedAttributes = {
    showConnectedChannels: facebookSources.length > 0,
    showSumOfChannels: totalFacebookSources.length,
    connectedChannel: facebookSources,
    displayFacebookImage: facebookSources.length > 0,
    ignoreChannelId: facebookSources.length > 0,
    ignoreSvgAvatar: facebookSources.length > 0,
  };

  const connectedAttributesExtra = {
    extraChannel: facebookSourcesExtra.length > 0,
    displayExtraChannel: facebookSourcesExtra.length,
  };

  return (
    <div className={styles.flexWrap}>
      <ChannelDetails
        title="Messenger "
        text="Connect multiple Facebook pages"
        image={<FacebookLogo />}
        buttonIcon={<AddChannel />}
        displayButton={facebookSources.length === 0}
      />

      <ChannelsConnected
        {...connectedAttributes}
        {...connectedAttributesExtra}
        connected="CONNECTED"
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default FacebookSource;
