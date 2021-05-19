import { getTextMessagePayload } from 'httpclient';
import React from 'react';
import {MediaTemplate as MediaTemplateModel} from '../../facebookModel';
import styles from './index.module.scss';

type MediaTemplateProps = {
  template: MediaTemplateModel;
};

//media_type: 'video' | 'image';
//url: string;
//buttons?: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton)[];

//add svg link in mediaType

export const MediaTemplate = ({template: {media_type, url, buttons}}: MediaTemplateProps) => {
  return (
    <div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        view the {media_type} on Facebook
      </a>
      {buttons.map((button, idx) => {
              return (
                <div key={`button-${idx}`} className={styles.button}>
                  {button.type === 'web_url' && url.length &&(
                    <a href={url} target="_blank" rel="noreferrer" className={styles.buttonText}>
                      {button.title}
                    </a>
                  )}

                {button.type === 'account_link' && url.length &&(
                    <a href={url} target="_blank" rel="noreferrer" className={styles.buttonText}>
                      {button.title}
                    </a>
                  )}


                </div>
              );
            })}
    </div>
  );
};


//web URL 
//login button 
//logout button 
//default: render just title 