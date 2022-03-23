import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {connectFacebookChannel} from '../../../../../actions/channel';

import {Button, Input, LinkButton, InfoButton} from 'components';
import {ConnectChannelFacebookRequestPayload} from 'httpclient/src';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/arrowLeft.svg';

import styles from './FacebookConnect.module.scss';

import {CHANNELS_CONNECTED_ROUTE} from '../../../../../routes/routes';
import {useCurrentChannel} from '../../../../../selectors/channels';
import {useNavigate} from 'react-router-dom';

const mapDispatchToProps = {
  connectFacebookChannel,
};

const connector = connect(null, mapDispatchToProps);

const FacebookConnect = (props: ConnectedProps<typeof connector>) => {
  const {connectFacebookChannel} = props;
  const channel = useCurrentChannel();
  const navigate = useNavigate();
  const [id, setId] = useState(channel?.sourceChannelId || '');
  const [token, setToken] = useState('');
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const [buttonTitle, setButtonTitle] = useState('Connect Page');
  const [errorMessage, setErrorMessage] = useState('');

  const buttonStatus = () => {
    return !(id.length > 5 && token != '');
  };

  useEffect(() => {
    if (channel) {
      setButtonTitle('Update Page');
    }
  }, []);

  const connectNewChannel = () => {
    const connectPayload: ConnectChannelFacebookRequestPayload = {
      pageId: id,
      pageToken: token,
      ...(name &&
        name !== '' && {
          name,
        }),
      ...(image &&
        image !== '' && {
          imageUrl: image,
        }),
    };

    connectFacebookChannel(connectPayload)
      .then(() => {
        navigate(CHANNELS_CONNECTED_ROUTE + '/facebook', {replace: true});
      })
      .catch(() => {
        setErrorMessage('Please check entered value');
      });
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>Facebook Messenger</h1>
      <div>
        <InfoButton
          link="https://airy.co/docs/core/sources/facebook"
          text="more information about this source"
          color="grey"
        />

        <LinkButton onClick={() => navigate(-1)} type="button">
          <ArrowLeftIcon className={styles.backIcon} />
          Back
        </LinkButton>
      </div>
      <div className={styles.inputContainer}>
        <Input
          id="id"
          label="Facebook Page ID"
          placeholder="Add the Facebook Page ID"
          value={id}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setId(event.target.value)}
          minLength={6}
          required={true}
          height={32}
          hint={errorMessage}
          fontClass="font-base"
        />
        <Input
          id="token"
          label="Token"
          placeholder="Add the page Access Token"
          value={token}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToken(event.target.value)}
          required={true}
          height={32}
          hint={errorMessage}
          fontClass="font-base"
        />
        <Input
          id="name"
          label="Name (optional)"
          placeholder="Add a name"
          hint="The standard name will be the same as the Facebook Page"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          height={32}
          fontClass="font-base"
        />
        <Input
          id="image"
          label="Image URL (optional)"
          placeholder="Add an URL"
          hint="The standard picture is the same as the Facebook Page"
          value={image}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setImage(event.target.value)}
          height={32}
          fontClass="font-base"
        />
      </div>
      <Button styleVariant="normal" disabled={buttonStatus()} onClick={() => connectNewChannel()}>
        {buttonTitle}
      </Button>
    </div>
  );
};

export default connector(FacebookConnect);
