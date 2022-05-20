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
import {t} from 'i18next';

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
  const [buttonTitle, setButtonTitle] = useState(t('connectPage'));
  const [errorMessage, setErrorMessage] = useState('');

  const CONNECTED_ROUTE = location.pathname.includes('connectors')
    ? CONNECTORS_CONNECTED_ROUTE
    : CATALOG_CONNECTED_ROUTE;

  const buttonStatus = () => {
    return !(id.length > 5 && name.length > 0);
  };

  useEffect(() => {
    if (channel) {
      setButtonTitle(t('updatePage'));
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
        setErrorMessage(t('errorMessage'));
      });
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>{t('googleTitle')}</h1>
      <div>
        <InfoButton link="https://airy.co/docs/core/sources/google" text={t('infoButtonText')} color="grey" />
        <LinkButton onClick={() => navigate(-1)} type="button">
          <ArrowLeftIcon className={styles.backIcon} />
          {t('back')}
        </LinkButton>
      </div>
      <div className={styles.inputContainer}>
        <Input
          id="id"
          label={t('agentId')}
          placeholder={t('googleAgentPlaceholder')}
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
          label={t('name')}
          placeholder={t('addAName')}
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          required={true}
          minLength={1}
          height={32}
          fontClass="font-base"
        />
        <Input
          id="image"
          label={t('imageUrlOptional')}
          placeholder={t('addAnUrl')}
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
