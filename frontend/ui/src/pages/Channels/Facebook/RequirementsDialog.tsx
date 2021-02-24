import React, {useState} from 'react';
import styles from './RequirementsDialog.module.scss';
import close from 'assets/images/icons/close.svg';

type RequirementsDialogProps = {
  show: boolean;
};

export const RequirementsDialog = (props: RequirementsDialogProps) => {
  const {show} = props;
  const [displayed, setDisplayed] = useState(show ? true : false);

  return (
    <>
      {displayed && (
        <div className={styles.container}>
          <button className={styles.closeButton} onClick={() => setDisplayed(false)}>
            <img src={close} />
          </button>
          <div className={styles.title}>
            <p>Connect Messenger</p>
          </div>
          <div className={styles.headline}>
            <p>The Facebook source requires the following configuration:</p>
          </div>
          <div className={styles.body}>
            <ul>
              <li>
                An app id and an app secret so that the platform can send messages back via your Facebook application
              </li>
              <li>A webhook integration so that the platform can ingest messages from your Facebook pages</li>
              <li>A page token for each facebook page you intend to integrate</li>
            </ul>
            <p>
              <a href="https://docs.airy.co/" target="_blank" rel="noreferrer">
                Check Airy&apos;s Documentation
              </a>{' '}
              for more information.
            </p>
          </div>
          <div className={styles.button}>
            <button type="button" onClick={() => console.log('CLICK CLICK')}>
              I&apos;m ready to connect
            </button>
          </div>
        </div>
      )}
    </>
  );
};
