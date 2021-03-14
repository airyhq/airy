import React, {useState, useEffect} from 'react';
import styles from './TwilioSmsConnect.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {Channel} from 'httpclient';
import {CHANNELS_CONNECTED_ROUTE, CHANNELS_TWILIO_WHATSAPP_ROUTE} from '../../../../routes/routes';
import {connectTwilioWhatsapp} from '../../../../actions/channel';
import {StateModel} from '../../../../reducers';
import SmsWhatsappForm from '../SourcesRequirement/SmsWhatsappForm';
import {allChannels} from '../../../../selectors/channels';
import {LinkButton} from '@airyhq/components';
interface TwilioWhatsappRouterProps {
  channelId?: string;
}
const mapDispatchToProps = {connectTwilioWhatsapp};
const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type TwilioWhatsappProps = {} & ConnectedProps<typeof connector> & RouteComponentProps<TwilioWhatsappRouterProps>;

const TwilioWhatsappConnect = (props: TwilioWhatsappProps) => {
  const [whatsappNumberInput, setWhatsappNumberInput] = useState('');
  const [whatsappNameInput, setWhatsappNameInput] = useState('');
  const [whatsappUrlInput, setWhatsappUrlInput] = useState('');
  const channelId = props.match.params.channelId;

  useEffect(() => {
    if (channelId !== 'new_account') {
      const channel = props.channels.find((channel: Channel) => {
        return channel.id === channelId;
      });
      if (channel) {
        setWhatsappNumberInput(channel.sourceChannelId || '');
        setWhatsappUrlInput(channel.metadata.imageUrl || '');
        setWhatsappNameInput(channel.metadata.name || '');
      }
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

      <SmsWhatsappForm
        connectTwilioSms={connectTwilioWhatsapp}
        twilioPhoneNumber="Twilio Phone Number"
        placeholder="Purchased Number +158129485394"
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
        namePlaceholder="SMS Acme Berlin"
        twilioNameInput={whatsappNameInput}
        handleNameInput={handleNameInput}
      />
    </div>
  );
};

export default connector(withRouter(TwilioWhatsappConnect));
