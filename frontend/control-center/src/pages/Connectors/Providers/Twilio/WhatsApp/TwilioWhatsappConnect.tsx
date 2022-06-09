import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {allChannels, useCurrentChannel} from '../../../../../selectors/channels';
import {Channel, Source} from 'model';
import TwilioConnect from '../TwilioConnect';
import {StateModel} from '../../../../../reducers';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
});

const connector = connect(mapStateToProps);

const TwilioWhatsappConnect = (props: ConnectedProps<typeof connector>) => {
  const {channels} = props;
  const {t} = useTranslation();
  const channel = useCurrentChannel();
  const {channelId} = useParams();
  const [buttonTitle, setButtonTitle] = useState(t('connectWhatsappNumber') || '');

  useEffect(() => {
    if (channel) {
      setButtonTitle(t('updateWhatsappNumber'));
    }
  }, []);

  useEffect(() => {
    if (channelId !== 'new') {
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
