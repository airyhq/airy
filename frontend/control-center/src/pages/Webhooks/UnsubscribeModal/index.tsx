import React from 'react';
import styles from './index.module.scss';

import {ReactComponent as ErrorMessage} from 'assets/images/icons/errorMessage.svg';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import {Button} from 'components/cta/Button';

type UnsubscribeModalProps = {
  setUnsubscribe: (unsubscribe: boolean) => void;
  setCancelUnsubscribe: (cancel: boolean) => void;
  webhookUrl: string;
  isLoading: boolean;
  error: boolean;
};

export const UnsubscribeModal = (props: UnsubscribeModalProps) => {
  const {setUnsubscribe, setCancelUnsubscribe, webhookUrl, isLoading, error} = props;

  const handleConfirm = () => {
    setUnsubscribe(true);
  };

  const handleCancel = () => {
    setCancelUnsubscribe(true);
  };

  return (
    <div className={styles.container}>
      <ErrorMessage height={140} width={140} />
      <h1>Unsubscribe Webhook</h1>
      <p>
        Are you sure <br /> you want to unsubsribe <br /> <br /> {webhookUrl}?
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
            {isLoading && <RefreshIcon height={24} width={24} />}
            {isLoading ? 'Unsubscribing...' : error ? 'Try again...' : 'Confirm'}
          </Button>
          <Button
            onClick={handleCancel}
            styleVariant="outline"
            style={{alignSelf: 'center', width: '213px', height: '48px', borderRadius: '10px'}}
            type="reset"
          >
            Cancel
          </Button>
        </div>
      </div>
      {error && <span className={styles.errorMessage}>Unable to unsubscribe Webhook</span>}
    </div>
  );
};
