import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {StateModel} from '../../../../../reducers';
import {allChannels} from '../../../../../selectors/channels';
import {Channel, Source} from 'model';
import TwilioConnect from '../TwilioConnect';

interface TwilioSmsRouterProps {
  channelId?: string;
}

const mapStateToProps = (state: StateModel, props: RouteComponentProps<{channelId: string}>) => ({
  channels: Object.values(allChannels(state)),
  channel: state.data.channels[props.match.params.channelId],
});

const connector = connect(mapStateToProps);

type TwilioSmsProps = {channelId?: string} & ConnectedProps<typeof connector> &
  RouteComponentProps<TwilioSmsRouterProps>;

const TwilioSmsConnect = (props: TwilioSmsProps) => {
  const {channels, channel} = props;

  const [buttonTitle, setButtonTitle] = useState('Connect Sms Number');

  const channelId = props.match.params.channelId;

  useEffect(() => {
    if (channel) {
      setButtonTitle('Update Sms Number');
    }
  }, []);

  useEffect(() => {
    if (channelId !== 'new_account' && channelId?.length) {
      channels.find((item: Channel) => {
        return item.id === channelId;
      });
    }
  }, [channels, channelId]);

  return <TwilioConnect channel={channel} source={Source.twilioSMS} pageTitle="SMS" buttonText={buttonTitle} />;
};

export default connector(withRouter(TwilioSmsConnect));
