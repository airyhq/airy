import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {connectViberChannel} from '../../../../actions/channel';
import {Input, NotificationComponent, SmartButton} from 'components';
import {ConnectViberRequestPayload} from 'httpclient/src';
import styles from './ViberConnect.module.scss';
import {useCurrentChannel} from '../../../../selectors/channels';
import {NotificationModel} from 'model';
import {useNavigate} from 'react-router-dom';
import {CONNECTORS_ROUTE} from '../../../../routes/routes';

const mapDispatchToProps = {
  connectViberChannel,
};

const connector = connect(null, mapDispatchToProps);

type ViberConnectProps = {
  modal?: boolean;
} & ConnectedProps<typeof connector>;

const ViberConnect = (props: ViberConnectProps) => {
  const {connectViberChannel, modal} = props;
  const channel = useCurrentChannel();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const buttonTitle = channel ? t('updatePage') : t('connectPage') || '';
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [isPending, setIsPending] = useState(false);

  const buttonStatus = () => {
    return (
      (channel?.metadata?.name === name && channel?.metadata?.imageUrl === image) ||
      (!!channel?.metadata?.imageUrl && image === '')
    );
  };

  const connectNewChannel = () => {
    const connectPayload: ConnectViberRequestPayload = {
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

    connectViberChannel(connectPayload)
      .then(() => {
        navigate(CONNECTORS_ROUTE + '/viber/connected', {replace: true});
      })
      .catch((error: Error) => {
        setNotification({show: true, text: t('updateFailed'), successful: false});
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
          id="name"
          label={t('name')}
          placeholder={t('addAName')}
          showLabelIcon
          tooltipText={t('optional')}
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
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
      <div className={styles.smartButtonContainer} style={modal ? {justifyContent: 'center'} : {}}>
        <SmartButton
          title={modal ? t('create') : buttonTitle}
          height={40}
          width={160}
          pending={isPending}
          type="submit"
          styleVariant="normal"
          disabled={buttonStatus() || isPending}
          onClick={() => connectNewChannel()}
        />
      </div>
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

export default connector(ViberConnect);
