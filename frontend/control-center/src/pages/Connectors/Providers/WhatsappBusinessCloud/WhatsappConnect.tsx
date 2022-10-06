import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {connectWhatsappChannel} from '../../../../actions/channel';
import {Input, NotificationComponent, SmartButton} from 'components';
import {ConnectWhatsappRequestPayload} from 'httpclient/src';
import styles from './WhatsappConnect.module.scss';
import {useCurrentChannel} from '../../../../selectors/channels';
import {NotificationModel} from 'model';
import {useNavigate} from 'react-router-dom';
import {CONNECTORS_ROUTE} from '../../../../routes/routes';

const mapDispatchToProps = {
  connectWhatsappChannel,
};

const connector = connect(null, mapDispatchToProps);

type WhatsappConnectProps = {
  modal?: boolean;
} & ConnectedProps<typeof connector>;

const WhatsappConnect = (props: WhatsappConnectProps) => {
  const {connectWhatsappChannel, modal} = props;
  const channel = useCurrentChannel();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [phoneNumberId, setPhoneNumberId] = useState(channel?.sourceChannelId || '');
  const [userToken, setUserToken] = useState(channel?.metadata?.userToken || '');
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const [error, setError] = useState(false);
  const connectError = t('connectFailed');
  const buttonTitle = channel ? t('updatePage') : t('connectPage') || '';
  const [newButtonTitle, setNewButtonTitle] = useState('');
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    modal && setError(false);
  }, [phoneNumberId, userToken, name]);

  useEffect(() => {
    if (channel?.sourceChannelId !== phoneNumberId && !!channel) {
      setNotification({show: true, text: t('newChannelInfo'), info: true});
      setNewButtonTitle(t('connect'));
    } else {
      setNewButtonTitle(buttonTitle);
    }
  }, [phoneNumberId]);

  const buttonStatus = () => {
    return (
      !(phoneNumberId.length > 5 && userToken !== '' && name !== '') ||
      (channel?.sourceChannelId === phoneNumberId &&
        channel?.metadata?.pageToken === userToken &&
        channel?.metadata?.name === name &&
        channel?.metadata?.imageUrl === image) ||
      (!!channel?.metadata?.imageUrl && image === '')
    );
  };

  const connectNewChannel = () => {
    const connectPayload: ConnectWhatsappRequestPayload = {
      phoneNumberId: phoneNumberId,
      userToken: userToken,
      name: name,
      ...(image &&
        image !== '' && {
          imageUrl: image,
        }),
    };

    setIsPending(true);

    connectWhatsappChannel(connectPayload)
      .then(() => {
        navigate(CONNECTORS_ROUTE + '/whatsapp/connected', {replace: true});
      })
      .catch((error: Error) => {
        setNotification({show: true, text: t('updateFailed'), successful: false});
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
          label={t('whatsappPhoneNumberId')}
          placeholder={t('whatsappPhoneNumberIdPlaceholder')}
          showLabelIcon
          tooltipText={t('whatsappPhoneNumberIdTooltip')}
          value={phoneNumberId}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhoneNumberId(event.target.value)}
          minLength={6}
          required
          height={32}
          fontClass="font-base"
        />
        <Input
          id="token"
          label={t('token')}
          placeholder={t('tokenPlaceholder')}
          value={userToken}
          showLabelIcon
          tooltipText={t('token')}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserToken(event.target.value)}
          required
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
          required
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
          successful={notification.successful}
          info={notification.info}
          setShowFalse={setNotification}
        />
      )}
    </div>
  );
};

export default connector(WhatsappConnect);
