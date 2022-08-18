import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {connectGoogleChannel} from '../../../../actions';
import {Button, Input, NotificationComponent} from 'components';
import {ConnectChannelGoogleRequestPayload} from 'httpclient/src';
import styles from './GoogleConnect.module.scss';
import {useCurrentChannel} from '../../../../selectors/channels';
import {useTranslation} from 'react-i18next';
import {Channel, NotificationModel} from 'model';

const mapDispatchToProps = {
  connectGoogleChannel,
};

const connector = connect(null, mapDispatchToProps);

const GoogleConnect = (props: ConnectedProps<typeof connector>) => {
  const {connectGoogleChannel} = props;
  const channel = useCurrentChannel();
  const {t} = useTranslation();
  const [id, setId] = useState(channel?.sourceChannelId || '');
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const [newChannelId, setNewChannelId] = useState('');
  const [buttonTitle, setButtonTitle] = useState((channel || newChannelId ? t('updatePage') : t('connectPage')) || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(false);
  const [notification, setNotification] = useState<NotificationModel>(null);

  const buttonStatus = () => {
    return (
      !(id.length > 5 && name.length > 0) ||
      (name === channel?.metadata?.name &&
        (image === channel?.metadata?.imageUrl || image === '') &&
        id === channel?.sourceChannelId)
    );
  };

  useEffect(() => {
    if (channel) {
      setButtonTitle(t('updatePage'));
    }
    if (id !== channel?.sourceChannelId && id !== '' && channel) {
      setInfoMessage(true);
      setNotification({show: true, text: t('newGoogleConnection')});
      setButtonTitle(t('connectPage'));
    }
  }, [channel, id]);

  const connectNewChannel = () => {
    const connectPayload: ConnectChannelGoogleRequestPayload = {
      gmbId: id || newChannelId,
      name: name,
      ...(image &&
        image !== '' && {
          imageUrl: image,
        }),
    };

    connectGoogleChannel(connectPayload)
      .then((channel: Channel) => {
        setNewChannelId(channel.id);
        setNotification({show: true, text: channel ? t('updateSuccessful') : t('createSuccessful'), successful: true});
        setButtonTitle(t('updatePage'));
      })
      .catch((error: Error) => {
        setNotification({show: true, text: channel ? t('updateFailed') : t('createFailed'), successful: false});
        setErrorMessage(t('errorMessage'));
        console.error(error);
      });
  };

  return (
    <div className={styles.wrapper}>
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
      {notification?.show && (
        <NotificationComponent
          type={infoMessage ? 'sticky' : 'fade'}
          show={notification.show}
          text={notification.text}
          successful={notification.successful}
          setShowFalse={setNotification}
          info={infoMessage ? true : false}
        />
      )}
    </div>
  );
};

export default connector(GoogleConnect);
