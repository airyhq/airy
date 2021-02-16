import React from 'react';
import styles from './GoogleSource.module.scss';
import {ReactComponent as GoogleLogo} from '../../../assets/images/icons/google_avatar.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../../assets/images/icons/placeholder.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type googleSourceProps = {googleSource: Channel[]};

const GoogleSource = (props: googleSourceProps) => {
  const googleSources = props.googleSource.filter(channel => channel.source === 'google').slice(0, 2);
  const googleSourcesExtra = props.googleSource.filter(channel => channel.source === 'google').slice(2);
  const totalGoogleSources = googleSources.concat(googleSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <ChannelDetails
        title="Google Business Messenger"
        text="Be there when people search"
        image={<GoogleLogo />}
        buttonIcon={<AddChannel />}
        shouldDisplayButton={googleSources.length === 0}
      />

      <ChannelsConnected
        showConnectedChannels={googleSources.length > 0}
        showSumOfChannels={totalGoogleSources.length}
        connected="CONNECTED"
        connectedChannel={googleSources}
        placeholderImage={<Placeholder />}
        extraChannel={googleSourcesExtra.length > 0}
        displayExtraChannel={googleSourcesExtra.length}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default GoogleSource;
