import React from 'react';
import styles from './WhatsappSmsSource.module.scss';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as AddChannel} from 'assets/images/icons/plus-circle.svg';
import {Channel} from 'httpclient';
import ChannelDetails from './ChannelDetails';
import ChannelsConnected from './ChannelsConnected';

type whatsappSourceProps = {whatsappSmsSource: Channel[]};

const WhatsappSmsSource = (props: whatsappSourceProps) => {
  const whatsappSources = props.whatsappSmsSource.filter(channel => channel.source === 'twilio.whatsapp').slice(0, 2);
  const whatsappSourcesExtra = props.whatsappSmsSource.filter(channel => channel.source === 'twilio.whatsapp').slice(2);
  const totalWhatsappSources = whatsappSources.concat(whatsappSourcesExtra);

  return (
    <div className={styles.flexWrap}>
      <ChannelDetails
        title="Whatsapp"
        text="World #1 chat app"
        image={<WhatsappLogo />}
        buttonIcon={<AddChannel />}
        displayButton={whatsappSources.length === 0}
      />

      <ChannelsConnected
        showConnectedChannels={whatsappSources.length > 0}
        showSumOfChannels={totalWhatsappSources.length}
        connected="CONNECTED"
        connectedChannel={whatsappSources}
        placeholderImage={<WhatsappLogo />}
        extraChannel={whatsappSourcesExtra.length > 0}
        displayExtraChannel={whatsappSourcesExtra.length}
        isConnected="connected"
        addAChannel={<AddChannel />}
      />
    </div>
  );
};

export default WhatsappSmsSource;
