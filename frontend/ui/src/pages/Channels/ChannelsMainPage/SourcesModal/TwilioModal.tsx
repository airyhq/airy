import React, {useState} from 'react';
import styles from './TwilioModal.module.scss';
import DialogChannel from '../../../../components/DialogChannel';

type TwilioModalProps = {};

export const TwilioModal = (props: TwilioModalProps) => {
  //const {show} = props;
  const [showModal, setShowModal] = useState(false);

  return (
    <DialogChannel onClose={() => console.log('New click')}>
      {!showModal && (
        <div className={styles.inviteWrapper}>
          <h1 className={styles.headline}>Connect with Twillo First</h1>
          <div className={styles.invitationFields}>
            Before you connect a number to SMS or Whatsapp, you must add a Twilio Auth Token to the
            infrastructure/airy.conf field
          </div>

          <div>After that you have to buy a number, check Airy&apos;s documentation for more details</div>
        </div>
      )}
    </DialogChannel>
  );
};

export default TwilioModal;
