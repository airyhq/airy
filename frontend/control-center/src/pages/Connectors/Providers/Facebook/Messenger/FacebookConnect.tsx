import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {connectFacebookChannel} from '../../../../../actions/channel';
import {Input, NotificationComponent, SmartButton} from 'components';
import {ConnectChannelFacebookRequestPayload} from 'httpclient/src';
import styles from './FacebookConnect.module.scss';
import {useCurrentChannel} from '../../../../../selectors/channels';
import {NotificationModel} from 'model';
import {useNavigate} from 'react-router-dom';
import {CONNECTORS_ROUTE} from '../../../../../routes/routes';

const mapDispatchToProps = {
  connectFacebookChannel,
};

const connector = connect(null, mapDispatchToProps);

const FacebookConnect = (props: ConnectedProps<typeof connector>) => {
  const {connectFacebookChannel} = props;
  const channel = useCurrentChannel();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [id, setId] = useState(channel?.sourceChannelId || '');
  const [token, setToken] = useState(channel?.metadata?.pageToken || '');
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const buttonTitle = channel ? t('updatePage') : t('connectPage') || '';
  const [newButtonTitle, setNewButtonTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (channel?.sourceChannelId !== id && !!channel) {
      setNotification({show: true, text: t('newChannelInfo'), info: true});
      setNewButtonTitle(t('connect'));
    } else {
      setNewButtonTitle(buttonTitle);
    }
  }, [id]);

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

    setIsPending(true);

    connectFacebookChannel(connectPayload)
      .then(() => {
        navigate(CONNECTORS_ROUTE + '/facebook/connected', {replace: true});
      })
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
          label={t('facebookPageId')}
          placeholder={t('facebookPageIdPlaceholder')}
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
        type="submit"
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

export default connector(FacebookConnect);
