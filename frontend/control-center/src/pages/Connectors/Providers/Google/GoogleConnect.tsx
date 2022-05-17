import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {connectGoogleChannel} from '../../../../actions';

import {Button, Input, LinkButton, InfoButton} from 'components';
import {ConnectChannelGoogleRequestPayload} from 'httpclient/src';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/arrowLeft.svg';

import styles from './GoogleConnect.module.scss';

import {CONNECTORS_CONNECTED_ROUTE, CATALOG_CONNECTED_ROUTE} from '../../../../routes/routes';
import {useCurrentChannel} from '../../../../selectors/channels';
import {useNavigate} from 'react-router-dom';

const mapDispatchToProps = {
  connectGoogleChannel,
};

const connector = connect(null, mapDispatchToProps);

const GoogleConnect = (props: ConnectedProps<typeof connector>) => {
  const {connectGoogleChannel} = props;
  const channel = useCurrentChannel();
  const navigate = useNavigate();
  const [id, setId] = useState(channel?.sourceChannelId || '');
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const [buttonTitle, setButtonTitle] = useState('Connect Page');
  const [errorMessage, setErrorMessage] = useState('');

  const CONNECTED_ROUTE = location.pathname.includes('connectors')
    ? CONNECTORS_CONNECTED_ROUTE
    : CATALOG_CONNECTED_ROUTE;

  const buttonStatus = () => {
    return !(id.length > 5 && name.length > 0);
  };

  useEffect(() => {
    if (channel) {
      setButtonTitle('Update Page');
    }
  }, [channel]);

  const connectNewChannel = () => {
    const connectPayload: ConnectChannelGoogleRequestPayload = {
      gmbId: id,
      name: name,
      ...(image &&
        image !== '' && {
          imageUrl: image,
        }),
    };

    connectGoogleChannel(connectPayload)
      .then(() => {
        navigate(CONNECTED_ROUTE + '/google', {replace: true});
      })
      .catch(() => {
        setErrorMessage('Please check entered value');
      });
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>Google Business Messages</h1>
      <div>
        <InfoButton
          link="https://airy.co/docs/core/sources/google"
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
          label="Agent ID"
          placeholder="Add the agent ID provided by your Google Partner"
          value={id}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setId(event.target.value)}
          minLength={6}
          required={true}
          height={32}
          hint={errorMessage}
          fontClass="font-base"
        />
        <Input
          id="name"
          label="Name"
          placeholder="Add a name"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          required={true}
          minLength={1}
          height={32}
          fontClass="font-base"
        />
        <Input
          id="image"
          label="Image URL (optional)"
          placeholder="Add an URL"
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

export default connector(GoogleConnect);
