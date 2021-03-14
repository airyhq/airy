import React from 'react';
import styles from './SmsWhatsappForm.module.scss';
import {Button, Input, UrlInputField} from '@airyhq/components';

type SmsWhatsappFormProps = {
  twilioPhoneNumber: string;
  placeholder: string;
  urlPlaceholder: string;
  namePlaceholder: string;
  name: string;
  urlName: string;
  accountName: string;
  text: string;
  urlText: string;
  imageUrl: string;
  twilioNumberInput: string;
  twilioUrlInput: string;
  twilioNameInput: string;

  handleNameInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNumberInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  connectTwilioSms: (e: React.ChangeEvent<HTMLFormElement>) => void;
};

const SmsWhatsappForm = (props: SmsWhatsappFormProps) => {
  return (
    <form onSubmit={props.connectTwilioSms} className={styles.formContainer}>
      <div className={styles.formContent}>
        <div className={styles.formContentNumber}>
          <Input
            label={props.twilioPhoneNumber}
            placeholder={props.placeholder}
            value={props.twilioNumberInput}
            required={true}
            height={32}
            autoFocus={true}
            onChange={props.handleNumberInput}
            fontClass="font-s"
          />
        </div>

        <div className={styles.formContentNumber}>
          <UrlInputField
            label={props.imageUrl}
            placeholder={props.urlPlaceholder}
            value={props.twilioUrlInput}
            required={false}
            height={32}
            onChange={props.handleUrlInput}
            fontClass="font-s"
          />
        </div>

        <div className={styles.formContentName}>
          <Input
            label={props.accountName}
            placeholder={props.namePlaceholder}
            value={props.twilioNameInput}
            required={false}
            height={32}
            onChange={props.handleNameInput}
            fontClass="font-s"
          />
        </div>
        <Button type="submit" styleVariant="normal" disabled={props.twilioNumberInput.trim().length == 0}>
          Connect SMS Number
        </Button>
      </div>
    </form>
  );
};

export default SmsWhatsappForm;
