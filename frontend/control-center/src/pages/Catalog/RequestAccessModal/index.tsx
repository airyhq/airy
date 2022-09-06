import React, {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Input, SettingsModal} from 'components';
import styles from './index.module.scss';
import {ReactComponent as InfoCircle} from 'assets/images/icons/infoCircle.svg';
import {NotificationModel} from 'model';

type RequestAccessModalProps = {
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  setNotification: Dispatch<SetStateAction<NotificationModel>>;
};

export const RequestAccessModal = (props: RequestAccessModalProps) => {
  const {setIsModalVisible, setNotification} = props;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSend = () => {
    setNotification({show: true, successful: true, text: t('requestAccessSuccessful')});
    setIsModalVisible(false);
  };

  const validInput = email.includes('@' && '.') && email.length > 5 && name;

  const {t} = useTranslation();
  return (
    <SettingsModal
      wrapperClassName={styles.enableModalContainerWrapper}
      containerClassName={styles.enableModalContainer}
      title={t('requestAccessTitle')}
      close={closeModal}
      headerClassName={styles.headerModal}
    >
      <Input
        type="email"
        id="email"
        label={t('emailCapital')}
        placeholder={t('addEmail')}
        showLabelIcon
        tooltipText={t('requestAccessEmailTooltip')}
        value={email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        required
        height={32}
        fontClass="font-base"
      />
      <Input
        id="name"
        label={t('name')}
        placeholder={t('addName')}
        showLabelIcon
        tooltipText={t('requestAccessNameTooltip')}
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
        required
        height={32}
        fontClass="font-base"
      />
      <div className={styles.messageContainer}>
        <span>{t('message')}</span>
        <InfoCircle width={20} className={styles.infoCircle} />
        <span className={styles.infoCircleText}>{t('optional')}</span>
      </div>
      <textarea
        placeholder={t('addMessage')}
        className={styles.messageTextArea}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value)}
        value={message}
      />
      <Button
        styleVariant="normal"
        type="submit"
        onClick={handleSend}
        className={styles.sendButton}
        disabled={!validInput}
      >
        {t('send')}
      </Button>
    </SettingsModal>
  );
};
