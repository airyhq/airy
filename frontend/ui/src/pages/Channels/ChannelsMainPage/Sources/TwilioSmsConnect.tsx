import React, {useState} from 'react';
import styles from './TwilioSmsConnect.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {CHANNELS_ROUTE} from '../../../../routes/routes';
import {CHANNELS_TWILIO_SMS_ROUTE_CONNECTED} from '../../../../routes/routes';
import {Button, Input, UrlInputField} from '@airyhq/components';
//import {ReactComponent as EmptyImage} from 'assets/images/icons/plus-circle.svg';
import {connectChannelTwilioSms} from '../../../../actions/channel';

// type TwilioSmsRouterProps = {
//   channelId?: string;
//   name: string;
//   placeholder: string;
//   required: boolean;
//   height: number;
//   value: string;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   history: History;
// };
interface TwilioSmsRouterProps {
  channelId?: string;
}

const mapDispatchToProps = {connectChannelTwilioSms};
const connector = connect(null, mapDispatchToProps);

type TwilioSmsProps = {} & ConnectedProps<typeof connector> & RouteComponentProps<TwilioSmsRouterProps>;

const TwilioSmsConnect = (props: TwilioSmsProps) => {
  const [twilloNumberInput, setTwilloNumberInput] = useState('');
  const [twilloNameInput, setTwilloNameInput] = useState('');
  const [twilloUrlInput, setTwilloUrlInput] = useState('');

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTwilloNumberInput(e.target.value);
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTwilloNameInput(e.target.value);
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTwilloUrlInput(e.target.value);
  };

  const sendTwilioData = () => {
    props
      .connectChannelTwilioSms('twilio.sms', {
        sourceChannelId: twilloNumberInput,
        name: twilloNameInput,
        imageUrl: twilloUrlInput,
      })
      .then(() => {
        props.history.push(CHANNELS_TWILIO_SMS_ROUTE_CONNECTED);
      });
  };

  const connectTwilioSms = (e: React.ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sendTwilioData();
  };

  console.log(twilloNumberInput);
  console.log(twilloNameInput);
  console.log(twilloUrlInput);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>SMS</h1>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>

      <form onSubmit={connectTwilioSms} className={styles.formContainer}>
        <div className={styles.formContent}>
          <div className={styles.formContentNumber}>
            <Input
              label="Twilio Phone Number"
              placeholder="Purchased Number +158129485394"
              name="name"
              type="text"
              value={twilloNumberInput}
              required={true}
              height={32}
              onChange={handleNumberInput}
            />
          </div>

          {/* TODO after Image upload is supported by backend */}
          {/*<div className={styles.formImageCard}>
            <div className={styles.emptyLogo}>
              <EmptyImage />
            </div>
            <div>
              <p className={styles.imageUploadText}>
                <a href="">Upload a Logo or Image</a>
              </p>
              <p className={styles.imageUploadSpecs}>1024x1024px PNG</p>
            </div>
          </div>

          <div className={styles.imageUploadFooter}>
            {' '}
            Internal use only: to differentiate between channels. In case you do not set an image, it will be a standard
            icon.
  </div>*/}

          <div className={styles.formContentNumber}>
            <UrlInputField
              label="Image URL (optional)"
              placeholder="Add an URL"
              name="url"
              type="url"
              value={twilloUrlInput}
              required={false}
              height={32}
              onChange={handleUrlInput}
            />
          </div>

          <div className={styles.formContentName}>
            <Input
              label="Add a Name (optional)"
              placeholder="SMS Acme Berlin"
              name="name"
              type="name"
              value={twilloNameInput}
              required={false}
              height={32}
              onChange={handleNameInput}
            />
          </div>
          <Button type="submit" styleVariant="normal" disabled={twilloNumberInput.trim().length == 0}>
            Connect SMS Number
          </Button>
        </div>
      </form>
    </div>
  );
};

export default connector(withRouter(TwilioSmsConnect));
