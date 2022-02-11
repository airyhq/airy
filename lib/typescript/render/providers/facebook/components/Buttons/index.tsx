import React from 'react';
import {URLButton, PostbackButton, CallButton, LoginButton, LogoutButton, GamePlayButton} from '../../facebookModel';
import styles from './index.module.scss';

type ButtonsProps = {
  buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
  mediaTemplate?: boolean;
};

export const Buttons = ({buttons, mediaTemplate}: ButtonsProps) => {
  return (
    <>
      {buttons.map((button, idx) => {
        return (
          <div key={`button-${idx}`} className={`${styles.button} ${mediaTemplate ? '' : styles.buttonMargin}`}>
            {(button.type === 'web_url' || button.type === 'open_url') && button.url.length ? (
              <a href={button.url} target="_blank" rel="noreferrer" className={styles.buttonText}>
                {button.title}
              </a>
            ) : button.type === 'account_link' ? (
              <div className={styles.buttonText}>Log In</div>
            ) : button.type === 'account_unlink' ? (
              <div className={styles.buttonText}>Log Out</div>
            ) : (
              <div className={styles.buttonText}>{button.title}</div>
            )}
          </div>
        );
      })}
    </>
  );
};
