import React from 'react';
import styles from './index.module.scss';

import {ReactComponent as ErrorMessage} from 'assets/images/icons/errorMessage.svg';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import {Button} from 'components/cta/Button';
import {useTranslation} from 'react-i18next';

type DisableModalProps = {
  setConfirmDisable: (confirm: boolean) => void;
  setCancelDisable: (cancel: boolean) => void;
  channel: string;
  channelLength: number;
  isLoading: boolean;
  error: boolean;
};

export const DisableModal = (props: DisableModalProps) => {
  const {setConfirmDisable, setCancelDisable, channel, channelLength, isLoading, error} = props;
  const {t} = useTranslation();

  const handleConfirm = () => {
    setConfirmDisable(true);
  };

  const handleCancel = () => {
    setCancelDisable(true);
  };

  return (
    <div className={styles.container}>
      <ErrorMessage height={140} width={140} />
      <h1>{t('disableChannels')}</h1>
      <p>
        {t('sureToDisable')}
        {channelLength} {channelLength === 1 ? t('channel') : t('channels')} {t('of')} {channel}?
      </p>
      <div className={styles.buttonContainer}>
        <div className={isLoading ? styles.spinAnimation : ''} style={{display: 'flex'}}>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignSelf: 'center',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              width: '213px',
              height: '48px',
              borderRadius: '10px',
            }}
            type="submit"
          >
            <>
              {isLoading && <RefreshIcon height={24} width={24} />}
              {isLoading ? t('unsubscribing') : error ? t('tryAgain') : t('confirm')}
            </>
          </Button>
          <Button
            onClick={handleCancel}
            styleVariant="outline"
            style={{alignSelf: 'center', width: '213px', height: '48px', borderRadius: '10px'}}
            type="reset"
          >
            {t('cancel')}
          </Button>
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{t('unableDisableChannel')}</span>}
    </div>
  );
};
