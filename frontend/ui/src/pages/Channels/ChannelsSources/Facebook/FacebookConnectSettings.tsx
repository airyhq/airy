import React from 'react';
import styles from './FacebookConnectSettings.module.scss';
import {ReactComponent as ArrowLeft} from 'assets/images/icons/arrow-left-2.svg';

type InputProps = {
  title: string;
  placeholder: string;
  optional?: boolean;
  optionalTitle?: string;
};

const Input = (props: InputProps) => {
  const {title, placeholder, optional, optionalTitle} = props;
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{title}</div>
      <div className={styles.inputInput}>
        <input placeholder={placeholder} />
      </div>
      <div className={styles.inputOptionalTitle}>{optional && <p>{optionalTitle}</p>}</div>
    </div>
  );
};

export const FacebookConnectSettings = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Facebook Messenger</h1>
      </div>
      <div className={styles.subtitle}>
        <button type="button" className={styles.backButton}>
          <ArrowLeft />
          Back to Channels
        </button>
      </div>
      <div>
        <Input title="Facebook Page Id" placeholder="Add the Facebook Page ID" />
        <Input title="Token" placeholder="Add the page Access Token" />
        <Input
          title="Name (optional)"
          placeholder="Add a name"
          optional={true}
          optionalTitle="The standard name will be the same as the Facebook Page"
        />
        <Input
          title="Image URL (optional)"
          placeholder="Add an URL"
          optional={true}
          optionalTitle="The standard picture is the same as the Facebook Page"
        />
      </div>
      <button type="button" className={styles.connectButton}>
        Connect Page
      </button>
    </div>
  );
};
