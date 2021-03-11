import React, {useState} from 'react';
import styles from './TwilioSmsConnect.module.scss';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {CHANNELS_ROUTE} from '../../../../routes/routes';
import {CHANNELS_TWILIO_SMS_ROUTE_CONNECTED} from '../../../../routes/routes';
import {Button, Input} from '@airyhq/components';
import {ReactComponent as EmptyImage} from 'assets/images/icons/plus-circle.svg';

type TwilioSmsProps = {
  channelId?: string;
  name: string;
  placeholder: string;
  required: boolean;
  height: number;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  history: History;
};

const TwilioSmsConnect = ({history}: TwilioSmsProps & RouteComponentProps) => {
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

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>SMS</h1>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>

      <form className={styles.formContainer}>
        <div className={styles.formContent}>
          <div className={styles.formContentNumber}>
            <p>Twilio Phone Number</p>
            <Input
              name="numberInput"
              placeholder="Purchased Number +158129485394"
              required={true}
              height={32}
              value={twilloNumberInput}
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
            <p>Image URL (optional)</p>
            <Input
              name="UrlInput"
              placeholder="Add an URL"
              required={false}
              height={32}
              value={twilloUrlInput}
              onChange={handleUrlInput}
            />
          </div>

          <div className={styles.formContentName}>
            <p>Add a Name (optional) </p>
            <Input
              name="nameInput"
              placeholder="SMS Acme Berlin"
              value={twilloNameInput}
              required={false}
              height={32}
              onChange={handleNameInput}
            />
          </div>
        </div>
      </form>

      <Button
        type="submit"
        styleVariant="normal"
        disabled={twilloNumberInput.trim().length == 0}
        onClick={() => {
          history.push(CHANNELS_TWILIO_SMS_ROUTE_CONNECTED);
        }}>
        {' '}
        Connect SMS Number
      </Button>
    </div>
  );
};

export default withRouter(TwilioSmsConnect);
