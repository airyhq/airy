import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';

import {allChannels} from '../../../../../selectors/channels';
import {Channel, Source} from 'model';
import TwilioConnect from '../TwilioConnect';
import {StateModel} from '../../../../../reducers';

interface TwilioWhatsappRouterProps {
  channelId?: string;
}

const mapStateToProps = (state: StateModel, props: RouteComponentProps<{channelId: string}>) => ({
  channels: Object.values(allChannels(state)),
  channel: state.data.channels[props.match.params.channelId],
});

const connector = connect(mapStateToProps);

type TwilioWhatsappProps = {channelId?: string} & ConnectedProps<typeof connector> &
  RouteComponentProps<TwilioWhatsappRouterProps>;

const TwilioWhatsappConnect = (props: TwilioWhatsappProps) => {
  const {channels, channel} = props;

  const [buttonTitle, setButtonTitle] = useState('Connect Whatsapp Number');

  const channelId = props.match.params.channelId;

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
    <TwilioConnect channel={channel} source={Source.twilioWhatsapp} pageTitle="Whatsapp" buttonText={buttonTitle} />
  );
};

export default connector(TwilioWhatsappConnect);
