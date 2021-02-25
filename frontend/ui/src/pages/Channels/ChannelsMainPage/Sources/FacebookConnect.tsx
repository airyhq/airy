import React, {useState} from 'react';
import styles from './FacebookConnect.module.scss';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {CHANNELS_ROUTE} from '../../../../routes/routes';
import {Button} from '@airyhq/components';

interface FacebookProps {
  channelId?: string;
}

type InputProps = {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  placeholder: string;
  optional?: boolean;
  optionalTitle?: string;
};

const Input = (props: InputProps) => {
  const {title, placeholder, optional, optionalTitle, value, onChange} = props;

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{title}</div>
      <div className={styles.inputInput}>
        <input placeholder={placeholder} value={value} onChange={onChange} />
      </div>
      <div className={styles.inputOptionalTitle}>{optional && <p>{optionalTitle}</p>}</div>
    </div>
  );
};

const FacebookConnect = (props: RouteComponentProps<FacebookProps>) => {
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  const buttonStatus = () => {
    if (id.length > 5 && token != '') {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>Facebook Messenger</h1>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>
      <div className={styles.container}>
        <Input
          id="id"
          title="Facebook Page ID"
          placeholder="Add the Facebook Page ID"
          value={id}
          onChange={event => setId(event.target.value)}
        />
        <Input
          id="token"
          title="Token"
          placeholder="Add the page Access Token"
          value={token}
          onChange={event => setToken(event.target.value)}
        />
        <Input
          id="name"
          title="Name (optional)"
          placeholder="Add a name"
          optional={true}
          optionalTitle="The standard name will be the same as the Facebook Page"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <Input
          id="image"
          title="Image URL (optional)"
          placeholder="Add an URL"
          optional={true}
          optionalTitle="The standard picture is the same as the Facebook Page"
          value={image}
          onChange={event => setImage(event.target.value)}
        />
      </div>
      <button type="button" className={styles.connectButton} disabled={buttonStatus()}>
        Connect Page
      </button>
      ]
    </div>
  );
};

export default withRouter(FacebookConnect);
