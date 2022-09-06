import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {connectInstagramChannel} from '../../../../actions';
import {Input, NotificationComponent, SmartButton} from 'components';
import {ConnectChannelInstagramRequestPayload} from 'httpclient/src';
import styles from './InstagramConnect.module.scss';
import {useCurrentChannel} from '../../../../selectors/channels';
import {useTranslation} from 'react-i18next';
import {NotificationModel} from 'model';

const mapDispatchToProps = {
  connectInstagramChannel,
};

const connector = connect(null, mapDispatchToProps);

const InstagramConnect = (props: ConnectedProps<typeof connector>) => {
  const {connectInstagramChannel} = props;
  const {t} = useTranslation();
  const channel = useCurrentChannel();
  const [id, setId] = useState(channel?.metadata?.pageId || '');
  const [token, setToken] = useState(channel?.metadata?.pageToken || '');
  const [accountId, setAccountId] = useState(channel?.sourceChannelId || '');
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const buttonTitle = channel ? t('updatePage') : t('connectPage') || '';
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [newButtonTitle, setNewButtonTitle] = useState('');
  const [isPending, setIsPending] = useState(false);

  const buttonStatus = () => {
    return (
      !(id.length > 5 && token != '') ||
      (channel?.sourceChannelId === id &&
        channel?.metadata?.pageToken === token &&
        channel?.metadata?.name === name &&
        channel?.metadata?.imageUrl === image) ||
      (!!channel?.metadata?.imageUrl && image === '')
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

  const connectNewChannel = () => {
    const connectPayload: ConnectChannelInstagramRequestPayload = {
      pageId: id,
      pageToken: token,
      accountId: accountId,
      ...(name &&
        name !== '' && {
          name,
        }),
      ...(image &&
        image !== '' && {
          imageUrl: image,
        }),
    };

    setIsPending(true);

    connectInstagramChannel(connectPayload)
      .catch((error: Error) => {
        setNotification({show: true, text: t('updateFailed'), successful: false});
        setErrorMessage(t('errorMessage'));
        console.error(error);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        <Input
          id="id"
          label={t('instagramAccount')}
          placeholder={t('instagramAccountPlaceholder')}
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
          label={t('token')}
          placeholder={t('tokenPlaceholder')}
          value={token}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToken(event.target.value)}
          required={true}
          height={32}
          hint={errorMessage}
          fontClass="font-base"
        />
        <Input
          id="account_id"
          label={t('instagramAccountId')}
          placeholder={t('instagramAccountIdPlaceholder')}
          value={accountId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAccountId(event.target.value)}
          required={true}
          height={32}
          hint={errorMessage}
          fontClass="font-base"
        />
        <Input
          id="name"
          label={t('nameOptional')}
          placeholder={t('addAName')}
          hint={t('nameFacebookPlaceholder')}
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          height={32}
          fontClass="font-base"
        />
        <Input
          id="image"
          label={t('imageUrlOptional')}
          placeholder={t('addAnUrl')}
          hint={t('imageFacebookHint')}
          value={image}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setImage(event.target.value)}
          height={32}
          fontClass="font-base"
        />
      </div>
      <SmartButton
        title={newButtonTitle !== '' ? newButtonTitle : buttonTitle}
        height={40}
        width={160}
        pending={isPending}
        className={styles.connectButton}
        styleVariant="normal"
        disabled={buttonStatus() || isPending}
        onClick={() => connectNewChannel()}
      />
      {notification?.show && (
        <NotificationComponent
          type={notification.info ? 'sticky' : 'fade'}
          show={notification.show}
          text={notification.text}
          successful={notification.successful}
          info={notification.info}
          setShowFalse={setNotification}
        />
      )}
    </div>
  );
};

export default connector(InstagramConnect);
