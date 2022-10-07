import React, {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Input, SettingsModal} from 'components';
import styles from './index.module.scss';
import {NotificationModel, Source} from 'model';
import {StateModel} from '../../../reducers';
import {connect, ConnectedProps} from 'react-redux';

const mapStateToProps = (state: StateModel) => ({
  user: state.data.user,
});

const connector = connect(mapStateToProps, null);

type NotifyMeModalProps = {
  source: Source;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  setNotification: Dispatch<SetStateAction<NotificationModel>>;
  setForceClose?: Dispatch<SetStateAction<boolean>>;
} & ConnectedProps<typeof connector>;

const NotifyMeModal = (props: NotifyMeModalProps) => {
  const {source, user, setIsModalVisible, setNotification, setForceClose} = props;
  const validEmail = user?.id?.slice(6).includes('@');
  const [email, setEmail] = useState(validEmail ? user?.id?.slice(6) : '');
  const [name, setName] = useState(user?.name || '');

  const closeModal = () => {
    setIsModalVisible(false);
    setForceClose(true);
  };

  const handleSend = () => {
    setNotification({show: true, successful: true, text: t('notifyMeSuccessful')});
    setIsModalVisible(false);
    setForceClose(true);
    localStorage.setItem(`notified.${source}`, `${email}`);
  };

  const validInput = email.includes('@' && '.') && email.length > 5 && name;

  const enterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const {t} = useTranslation();
  return (
    <SettingsModal
      wrapperClassName={styles.enableModalContainerWrapper}
      containerClassName={styles.enableModalContainer}
      title={t('notifyMeTitle')}
      close={closeModal}
      headerClassName={styles.headerModal}
    >
      <Input
        autoFocus={true}
        type="email"
        id="email"
        label={t('emailCapital')}
        placeholder={t('addEmail')}
        showLabelIcon
        tooltipText={t('notifyMeEmailTooltip')}
        tooltipStyle={styles.toolTip}
        value={email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        required
        height={32}
        onKeyDown={enterPress}
        fontClass="font-base"
      />
      <Input
        id="name"
        label={t('name')}
        placeholder={t('addName')}
        showLabelIcon
        tooltipText={t('notifyMeNameTooltip')}
        tooltipStyle={styles.toolTip}
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
        required
        height={32}
        onKeyDown={enterPress}
        fontClass="font-base"
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

export default connector(NotifyMeModal);
