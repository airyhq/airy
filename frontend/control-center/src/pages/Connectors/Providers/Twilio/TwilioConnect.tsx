import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {connectTwilioSms, connectTwilioWhatsapp} from '../../../../actions';

import {Button, Input, UrlInputField} from 'components';
import {Channel, Source} from 'model';

import styles from './TwilioConnect.module.scss';

import {CONNECTORS_CONNECTED_ROUTE} from '../../../../routes/routes';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

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
  const {channel, source, buttonText, connectTwilioWhatsapp, connectTwilioSms} = props;
  const {t} = useTranslation();

  const navigate = useNavigate();
  const [numberInput, setNumberInput] = useState(channel?.sourceChannelId || '');
  const [nameInput, setNameInput] = useState(channel?.metadata?.name || '');
  const [imageUrlInput, setImageUrlInput] = useState(channel?.metadata?.imageUrl || '');

  const CONNECTED_ROUTE = CONNECTORS_CONNECTED_ROUTE;

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
        navigate(CONNECTED_ROUTE + `/twilio.whatsapp/#`, {
          replace: true,
          state: {source: 'twilio.whatsapp'},
        });
      });
    }
    if (source === Source.twilioSMS) {
      connectTwilioSms(connectPayload).then(() => {
        navigate(CONNECTED_ROUTE + `/twilio.sms/#`, {replace: true, state: {source: 'twilio.sms'}});
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.formContainer}>
        <div className={styles.formContent}>
          <div className={styles.formContentNumber}>
            <Input
              label={t('twilioPhoneNumber')}
              placeholder={t('twilioPhoneNumberPlaceholder')}
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
              label={t('nameOptional')}
              placeholder={t('addAName')}
              value={nameInput}
              required={false}
              height={32}
              onChange={handleNameInput}
              fontClass="font-base"
            />
          </div>
          <div className={styles.formContentNumber}>
            <UrlInputField
              label={t('imageUrlOptional')}
              placeholder={t('addAnUrl')}
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
