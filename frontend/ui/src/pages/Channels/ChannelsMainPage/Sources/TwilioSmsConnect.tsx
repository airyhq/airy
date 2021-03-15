import React, {useState, useEffect} from 'react';
import styles from './TwilioSmsConnect.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {LinkButton} from '@airyhq/components';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {Channel} from 'httpclient';
import {CHANNELS_CONNECTED_ROUTE} from '../../../../routes/routes';
import {connectTwilioSms, disconnectChannel} from '../../../../actions/channel';
import {StateModel} from '../../../../reducers';
import {allChannels} from '../../../../selectors/channels';
import SmsWhatsappForm from '../../Twilio/SmsWhatsappForm';

interface TwilioSmsRouterProps {
  channelId?: string;
}

const mapDispatchToProps = {connectTwilioSms, disconnectChannel};
const mapStateToProps = (state: StateModel, props: RouteComponentProps<{channelId: string}>) => ({
  channels: Object.values(allChannels(state)),
  channel: state.data.channels[props.match.params.channelId],
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type TwilioSmsProps = {channelId?: string} & ConnectedProps<typeof connector> &
  RouteComponentProps<TwilioSmsRouterProps>;

const TwilioSmsConnect = (props: TwilioSmsProps) => {
  const {channel} = props;
  const [smsNumberInput, setSmsNumberInput] = useState(channel?.sourceChannelId || '');
  const [smsNameInput, setSmsNameInput] = useState(channel?.metadata?.name || '');
  const [smsUrlInput, setSmsUrlInput] = useState(channel?.metadata?.imageUrl || '');
  const [buttonTitle, setButtonTitle] = useState('Connect Sms Number');
  const channelId = props.match.params.channelId;

  useEffect(() => {
    if (channel) {
      setButtonTitle('Update Sms Number');
    }
  }, []);

  useEffect(() => {
    if (channelId !== 'new_account' && channelId?.length) {
      props.channels.find((channel: Channel) => {
        return channel.id === channelId;
      });
    }
  }, [props.channels, channelId]);

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSmsNumberInput(e.target.value);
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSmsNameInput(e.target.value);
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSmsUrlInput(e.target.value);
  };

  const sendTwilioSmsData = () => {
    props
      .connectTwilioSms({
        sourceChannelId: smsNumberInput,
        name: smsNameInput,
        imageUrl: smsUrlInput,
      })
      .then(() => {
        props.history.replace(CHANNELS_CONNECTED_ROUTE + `/twilio.sms/#`);
      });
  };

  const connectTwilioSms = (e: React.ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sendTwilioSmsData();
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>SMS</h1>
      <LinkButton onClick={props.history.goBack} type="button">
        <BackIcon className={styles.backIcon} />
        Back
      </LinkButton>

      <SmsWhatsappForm
        connectTwilioSms={connectTwilioSms}
        twilioPhoneNumber="Twilio Phone Number"
        placeholder="Purchased Number +123456789"
        name="name"
        text="text"
        twilioNumberInput={smsNumberInput}
        handleNumberInput={handleNumberInput}
        imageUrl="Image URL (optional)"
        urlPlaceholder="Add an URL"
        urlName="url"
        urlText="url"
        twilioUrlInput={smsUrlInput}
        handleUrlInput={handleUrlInput}
        accountName="Add a Name (optional)"
        namePlaceholder="Add a Name"
        twilioNameInput={smsNameInput}
        handleNameInput={handleNameInput}
        smsFormButton={buttonTitle}
      />
    </div>
  );
};

export default connector(withRouter(TwilioSmsConnect));
