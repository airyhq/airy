import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {connectGoogleChannel} from '../../../../actions';

import {Input, NotificationComponent, SmartButton} from 'components';
import {ConnectChannelGoogleRequestPayload} from 'httpclient/src';

import styles from './GoogleConnect.module.scss';

import {CONNECTORS_ROUTE} from '../../../../routes/routes';
import {useCurrentChannel} from '../../../../selectors/channels';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {NotificationModel} from 'model';

const mapDispatchToProps = {
  connectGoogleChannel,
};

const connector = connect(null, mapDispatchToProps);

type GoogleConnectProps = {
  modal?: boolean;
} & ConnectedProps<typeof connector>;

const GoogleConnect = (props: GoogleConnectProps) => {
  const {connectGoogleChannel, modal} = props;
  const channel = useCurrentChannel();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [id, setId] = useState(channel?.sourceChannelId || '');
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const [error, setError] = useState(false);
  const connectError = t('connectFailed');
  const buttonTitle = channel ? t('updatePage') : t('connectPage') || '';
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [isPending, setIsPending] = useState(false);
  const [newButtonTitle, setNewButtonTitle] = useState('');

  useEffect(() => {
    modal && setError(false);
  }, [id, name]);

  const buttonStatus = () => {
    return (
      !(id.length > 5 && name.length > 0) ||
      (channel?.sourceChannelId === id &&
        channel?.metadata?.name === name &&
        (channel?.metadata?.imageUrl === image || image === ''))
    );
  };

  useEffect(() => {
    if (channel?.sourceChannelId !== id && !!channel) {
      setNotification({show: true, text: t('newChannelInfo'), info: true});
      setNewButtonTitle(t('connectPage'));
    } else {
      setNewButtonTitle(buttonTitle);
    }
  }, [id]);

  useEffect(() => {
    if (channel) {
      setNewButtonTitle(t('updatePage'));
    }
  }, [channel]);

  const connectNewChannel = () => {
    setIsPending(true);
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
        navigate(CONNECTORS_ROUTE + '/google/connected', {replace: true});
      })
      .catch((error: Error) => {
        setNotification({
          show: true,
          text: buttonTitle === t('connectPage') ? t('connectFailed') : 'updateFailed',
          successful: false,
          info: false,
        });
        modal && setError(true);
        console.error(error);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={modal ? styles.inputContainerModal : styles.inputContainer}>
        <Input
          id="id"
          label={t('agentId')}
          placeholder={t('googleAgentPlaceholder')}
          showLabelIcon
          tooltipText={t('addAgentId')}
          value={id}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setId(event.target.value)}
          minLength={6}
          required={true}
          height={32}
          fontClass="font-base"
        />
        <Input
          id="name"
          label={t('name')}
          placeholder={t('addAName')}
          showLabelIcon
          tooltipText={t('addName')}
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          required={true}
          minLength={1}
          height={32}
          fontClass="font-base"
        />
        <Input
          type="url"
          id="image"
          label={t('imageUrl')}
          placeholder={t('addAnUrl')}
          showLabelIcon
          tooltipText={t('optional')}
          value={image}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setImage(event.target.value)}
          height={32}
          fontClass="font-base"
        />
      </div>
      <div className={`${modal ? styles.smartButtonModalContainer : styles.smartButtonContainer}`}>
        <SmartButton
          title={modal ? t('create') : newButtonTitle !== '' ? newButtonTitle : buttonTitle}
          height={40}
          width={160}
          pending={isPending}
          type="submit"
          styleVariant="normal"
          disabled={buttonStatus() || isPending}
          onClick={() => connectNewChannel()}
        />
        {modal && <span className={error ? styles.errorMessage : ''}>{connectError}</span>}
      </div>
      {notification?.show && !modal && (
        <NotificationComponent
          type={notification.info ? 'sticky' : 'fade'}
          show={notification.show}
          text={notification.text}
          info={notification.info}
          setShowFalse={setNotification}
        />
      )}
    </div>
  );
};

export default connector(GoogleConnect);
