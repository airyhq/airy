import React from 'react';
import styles from './index.module.scss';

import {ReactComponent as ErrorMessage} from 'assets/images/icons/errorMessage.svg';
import {Button} from 'components/cta/Button';

type UnsubscribeModalProps = {
  setUnsubscribe: (unsubscribe: boolean) => void;
  setCancelUnsubscribe: (cancel: boolean) => void;
  webhookUrl: string;
};

export const UnsubscribeModal = (props: UnsubscribeModalProps) => {
  const {setUnsubscribe, setCancelUnsubscribe, webhookUrl} = props;

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
        Are you sure you want to unsubsribe to {webhookUrl}?
      </p>
      <div className={styles.buttonContainer}>
        <Button
          onClick={handleConfirm}
          style={{alignSelf: 'center', width: '213px', height: '48px', borderRadius: '10px'}}
          type="submit">
          Confirm
        </Button>
        <Button
          onClick={handleCancel}
          styleVariant="outline"
          style={{alignSelf: 'center', width: '213px', height: '48px', borderRadius: '10px'}}
          type="reset">
          Cancel
        </Button>
      </div>
    </div>
  );
};
