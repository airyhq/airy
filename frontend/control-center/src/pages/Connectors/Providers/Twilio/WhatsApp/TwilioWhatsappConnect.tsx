import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {allConnectors, useCurrentConnector} from '../../../../../selectors/connectors';
import {Channel, Source} from 'model';
import TwilioConnect from '../TwilioConnect';
import {StateModel} from '../../../../../reducers';
import {useParams} from 'react-router-dom';

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allConnectors(state)),
});

const connector = connect(mapStateToProps);

const TwilioWhatsappConnect = (props: ConnectedProps<typeof connector>) => {
  const {channels} = props;

  const channel = useCurrentConnector();
  const {channelId} = useParams();
  const [buttonTitle, setButtonTitle] = useState('Connect Whatsapp Number');

  useEffect(() => {
    if (channel) {
      setButtonTitle('Update Whatsapp Number');
    }
  }, []);

  useEffect(() => {
    if (channelId !== 'new_account') {
      channels.find((item: Channel) => {
        return item.id === channelId;
      });
    }
  }, [channels, channelId]);

  return (
    <TwilioConnect
      channel={channel}
      source={Source.twilioWhatsApp}
      pageTitle="Whatsapp"
      buttonText={buttonTitle}
      infoLink="https://airy.co/docs/core/sources/whatsapp-twilio"
    />
  );
};

export default connector(TwilioWhatsappConnect);
