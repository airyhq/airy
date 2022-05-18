import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {StateModel} from '../../../../../reducers';
import {allChannels, useCurrentChannel} from '../../../../../selectors/channels';
import {Channel, Source} from 'model';
import TwilioConnect from '../TwilioConnect';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
});

const connector = connect(mapStateToProps);

const TwilioSmsConnect = (props: ConnectedProps<typeof connector>) => {
  const {channels} = props;
  const {t} = useTranslation();
  const {channelId} = useParams();
  const channel = useCurrentChannel();

  const [buttonTitle, setButtonTitle] = useState(t('connectSmsNumber'));

  useEffect(() => {
    if (channel) {
      setButtonTitle(t('updateSmsNumber'));
    }
  }, []);

  useEffect(() => {
    if (channelId !== 'new' && channelId?.length) {
      channels.find((item: Channel) => {
        return item.id === channelId;
      });
    }
  }, [channels, channelId]);

  return (
    <TwilioConnect
      channel={channel}
      source={Source.twilioSMS}
      pageTitle="SMS"
      buttonText={buttonTitle}
      infoLink="https://airy.co/docs/core/sources/sms-twilio"
    />
  );
};

export default connector(TwilioSmsConnect);
