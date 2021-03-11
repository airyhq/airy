import React, {useState} from 'react';
import styles from './TwilioSmsModal.module.scss';
import Dialog from '../../../../components/Dialog';

const TwilioSmsModal: React.FC = (): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Dialog onClose={() => console.log('New click')}>
      {!showModal && (
        <div className={styles.inviteWrapper}>
          <h1 className={styles.headline}>Connect with Twillo First</h1>
          <div className={styles.invitationFields}>
            Before you connect a number to SMS or Whatsapp, you must add a Twillio Auth Token to the
            infrastructure/airy.conf field
          </div>

          <div>After that you have to buy a number, check Airy&apos;s documentation for more details</div>
        </div>
      )}
    </Dialog>
  );
};

export default TwilioSmsModal;
