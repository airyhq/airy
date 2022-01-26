import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {connectTwilioSms, connectTwilioWhatsapp} from '../../../../actions';

import {Button, Input, LinkButton, UrlInputField, InfoButton} from 'components';
import {Channel, Source} from 'model';
import {ReactComponent as ArrowLeft} from 'assets/images/icons/arrow-left-2.svg';

import styles from './TwilioConnect.module.scss';

import {CHANNELS_CONNECTED_ROUTE} from '../../../../routes/routes';
import {useNavigate} from 'react-router-dom';

type TwilioConnectProps = {
  channel?: Channel;
  source: string;
  pageTitle: string;
  buttonText: string;
  infoLink: string;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {connectTwilioWhatsapp, connectTwilioSms};

const connector = connect(null, mapDispatchToProps);

const TwilioConnect = (props: TwilioConnectProps) => {
  const {channel, source, pageTitle, buttonText, infoLink, connectTwilioWhatsapp, connectTwilioSms} = props;

  const navigate = useNavigate();
  const [numberInput, setNumberInput] = useState(channel?.sourceChannelId || '');
  const [nameInput, setNameInput] = useState(channel?.metadata?.name || '');
  const [imageUrlInput, setImageUrlInput] = useState(channel?.metadata?.imageUrl || '');

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNumberInput(e.target.value);
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNameInput(e.target.value);
  };

  const handleImageUrlInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setImageUrlInput(e.target.value);
  };

  const connectTwilioChannel = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const connectPayload = {
      sourceChannelId: numberInput,
      name: nameInput,
      imageUrl: imageUrlInput,
    };

    if (source === Source.twilioWhatsApp) {
      connectTwilioWhatsapp(connectPayload).then(() => {
        navigate(CHANNELS_CONNECTED_ROUTE + `/twilio.whatsapp/#`, {
          replace: true,
          state: {source: 'twilio.whatsapp'},
        });
      });
    }
    if (source === Source.twilioSMS) {
      connectTwilioSms(connectPayload).then(() => {
        navigate(CHANNELS_CONNECTED_ROUTE + `/twilio.sms/#`, {replace: true, state: {source: 'twilio.sms'}});
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>{pageTitle}</h1>
      <div>
        <InfoButton link={infoLink} text="more information about this source" color="grey" />
        <LinkButton onClick={() => navigate(-1)} type="button">
          <ArrowLeft className={styles.backIcon} />
          Back
        </LinkButton>
      </div>
      <form className={styles.formContainer}>
        <div className={styles.formContent}>
          <div className={styles.formContentNumber}>
            <Input
              label="Twilio Phone Number"
              placeholder="Purchased Number +123456789"
              value={numberInput}
              required={true}
              height={32}
              autoFocus={true}
              onChange={handleNumberInput}
              fontClass="font-base"
            />
          </div>
          <div className={styles.formContentName}>
            <Input
              label="Add a Name (optional)"
              placeholder="Add a name"
              value={nameInput}
              required={false}
              height={32}
              onChange={handleNameInput}
              fontClass="font-base"
            />
          </div>
          <div className={styles.formContentNumber}>
            <UrlInputField
              label="Image URL (optional)"
              placeholder="Add an URL"
              value={imageUrlInput}
              required={false}
              height={32}
              onChange={handleImageUrlInput}
              fontClass="font-base"
            />
          </div>
          <Button
            type="submit"
            styleVariant="normal"
            disabled={numberInput.trim().length === 0}
            onClick={(e: React.ChangeEvent<HTMLFormElement>) => connectTwilioChannel(e)}
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default connector(TwilioConnect);
