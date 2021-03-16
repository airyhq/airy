import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {allChannels} from '../../../../../selectors/channels';
import {connectTwilioWhatsapp} from '../../../../../actions/channel';

import {LinkButton} from '@airyhq/components';
import {Channel} from 'httpclient';
import TwilioSmsWhatsappConnect from '../TwilioSmsWhatsappConnect';
import {StateModel} from '../../../../../reducers';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';

import styles from './TwilioWhatsappConnect.module.scss';

import {CHANNELS_CONNECTED_ROUTE} from '../../../../../routes/routes';

interface TwilioWhatsappRouterProps {
  channelId?: string;
}
const mapDispatchToProps = {connectTwilioWhatsapp};
const mapStateToProps = (state: StateModel, props: RouteComponentProps<{channelId: string}>) => ({
  channels: Object.values(allChannels(state)),
  channel: state.data.channels[props.match.params.channelId],
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type TwilioWhatsappProps = {channelId?: string} & ConnectedProps<typeof connector> &
  RouteComponentProps<TwilioWhatsappRouterProps>;

const TwilioWhatsappConnect = (props: TwilioWhatsappProps) => {
  const {channel} = props;
  const [whatsappNumberInput, setWhatsappNumberInput] = useState(channel?.sourceChannelId || '');
  const [whatsappNameInput, setWhatsappNameInput] = useState(channel?.metadata?.name || '');
  const [whatsappUrlInput, setWhatsappUrlInput] = useState(channel?.metadata?.imageUrl || '');
  const [buttonTitle, setButtonTitle] = useState('Connect Whatsapp Number');
  const channelId = props.match.params.channelId;

  useEffect(() => {
    if (channel) {
      setButtonTitle('Update Whatsapp Number');
    }
  }, []);

  useEffect(() => {
    if (channelId !== 'new_account') {
      props.channels.find((channel: Channel) => {
        return channel.id === channelId;
      });
    }
  }, [props.channels, channelId]);

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setWhatsappNumberInput(e.target.value);
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setWhatsappNameInput(e.target.value);
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setWhatsappUrlInput(e.target.value);
  };

  const sendTwilioWhatsappData = () => {
    props
      .connectTwilioWhatsapp({
        sourceChannelId: whatsappNumberInput,
        name: whatsappNameInput,
        imageUrl: whatsappUrlInput,
      })
      .then(() => {
        props.history.replace({
          pathname: CHANNELS_CONNECTED_ROUTE + `/twilio.whatsapp/#`,
          state: {source: 'twilio.whatsapp'},
        });
      });
  };

  const connectTwilioWhatsapp = (e: React.ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sendTwilioWhatsappData();
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>WhatsApp</h1>

      <LinkButton onClick={props.history.goBack} type="button">
        <BackIcon className={styles.backIcon} />
        Back
      </LinkButton>

      <TwilioSmsWhatsappConnect
        connectTwilioSms={connectTwilioWhatsapp}
        twilioPhoneNumber="Twilio Phone Number"
        placeholder="Purchased Number +123456789"
        name="name"
        text="text"
        twilioNumberInput={whatsappNumberInput}
        handleNumberInput={handleNumberInput}
        imageUrl="Image URL (optional)"
        urlPlaceholder="Add an URL"
        urlName="url"
        urlText="url"
        twilioUrlInput={whatsappUrlInput}
        handleUrlInput={handleUrlInput}
        accountName="Add a Name (optional)"
        namePlaceholder="Add a name"
        twilioNameInput={whatsappNameInput}
        handleNameInput={handleNameInput}
        whatsappFormButton={buttonTitle}
      />
    </div>
  );
};

export default connector(withRouter(TwilioWhatsappConnect));
