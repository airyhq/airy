import React from 'react';
import styles from './FacebookSource.module.scss';
import {ReactComponent as FacebookLogo} from '../../../assets/images/icons/messenger_avatar.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../../assets/images/icons/placeholder.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type facebookSourceProps = {facebookSource: Channel[]};

const FacebookSource = (props: facebookSourceProps) => {
  const facebookSources = props.facebookSource.filter(channel => channel.source === 'facebook').slice(0, 4);
  const facebookSourcesExtra = props.facebookSource.filter(channel => channel.source === 'facebook').slice(4);
  const totalFacebookSources = facebookSources.concat(facebookSourcesExtra);

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
        showConnectedChannels={facebookSources.length > 0}
        showSumOfChannels={totalFacebookSources.length}
        connected="CONNECTED"
        connectedChannel={facebookSources}
        extraChannel={facebookSourcesExtra.length > 0}
        displayExtraChannel={facebookSourcesExtra.length}
        isConnected="connected"
        addAChannel={<AddChannel />}
        ignoreChannelId={facebookSources.length > 0}
        ignorePlaceholder={facebookSources.length > 0}
        displayFacebookImage={facebookSources.length > 0}
      />
    </div>
  );
};

export default FacebookSource;
