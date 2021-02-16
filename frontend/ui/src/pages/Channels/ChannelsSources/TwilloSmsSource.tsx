import React from 'react';
import styles from './TwilloSmsSource.module.scss';
import {ReactComponent as SMSLogo} from '../../../assets/images/icons/sms.svg';
import {ReactComponent as AddChannel} from '../../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../../assets/images/icons/placeholder.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type twilloSmsSourceProps = {twilloSmsSource: Channel[]};

const TwilloSmsSource = (props: twilloSmsSourceProps) => {
  const twilloSources = props.twilloSmsSource.filter(channel => channel.source === 'twilio.sms').slice(0, 2);
  const twilloSourcesExtra = props.twilloSmsSource.filter(channel => channel.source === 'twilio.sms').slice(2);
  const totalTwilloSources = twilloSources.concat(twilloSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <ChannelDetails
        title="SMS "
        text="Deliver SMS with ease"
        image={<SMSLogo />}
        buttonIcon={<AddChannel />}
        shouldDisplayButton={twilloSources.length === 0}
      />

      <ChannelsConnected
        showConnectedChannels={twilloSources.length > 0}
        showSumOfChannels={totalTwilloSources.length}
        connected="CONNECTED"
        connectedChannel={twilloSources}
        placeholderImage={<Placeholder />}
        extraChannel={twilloSourcesExtra.length > 0}
        displayExtraChannel={twilloSourcesExtra.length}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default TwilloSmsSource;
