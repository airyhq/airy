import React, {useState} from 'react';
import styles from './TwilioSmsConnect.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {CHANNELS_ROUTE} from '../../../../routes/routes';
import {CHANNELS_TWILIO_SMS_ROUTE_CONNECTED} from '../../../../routes/routes';
import {connectChannelTwilioWhatsapp} from '../../../../actions/channel';
import {StateModel} from '../../../../reducers';
import SmsWhatsappForm from '../SourcesRequirement/SmsWhatsappForm';

interface TwilioWhatsappRouterProps {
  channelId?: string;
}
const mapDispatchToProps = {connectChannelTwilioWhatsapp};
const mapStateToProps = (state: StateModel) => ({
  channel: state.data.channels,
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type TwilioWhatsappProps = {} & ConnectedProps<typeof connector> & RouteComponentProps<TwilioWhatsappRouterProps>;

const TwilioWhatsappConnect = (props: TwilioWhatsappProps) => {
  const [whatsappNumberInput, setWhatsappNumberInput] = useState('');
  const [whatsappNameInput, setWhatsappNameInput] = useState('');
  const [whatsappUrlInput, setWhatsappUrlInput] = useState('');

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
    props.connectChannelTwilioWhatsapp({
      sourceChannelId: whatsappNumberInput,
      name: whatsappNameInput,
      imageUrl: whatsappUrlInput,
    });
    //   .then(() => {
    //     props.history.push(CHANNELS_TWILIO_SMS_ROUTE_CONNECTED);
    //   });
  };

  const connectTwilioWhatsapp = (e: React.ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sendTwilioWhatsappData();
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>WhatsApp</h1>

      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>

      <SmsWhatsappForm
        connectTwilioSms={connectTwilioWhatsapp}
        twilioPhoneNumber="Twilio Phone Number"
        placeholder="Purchased Number +158129485394"
        name="name"
        text="text"
        twilloNumberInput={whatsappNumberInput}
        handleNumberInput={handleNumberInput}
        imageUrl="Image URL (optional)"
        urlPlaceholder="Add an URL"
        urlName="url"
        urlText="url"
        twilloUrlInput={whatsappUrlInput}
        handleUrlInput={handleUrlInput}
        accountName="Add a Name (optional)"
        namePlaceholder="SMS Acme Berlin"
        twilloNameInput={whatsappNameInput}
        handleNameInput={handleNameInput}
      />
    </div>
  );
};

export default connector(withRouter(TwilioWhatsappConnect));
