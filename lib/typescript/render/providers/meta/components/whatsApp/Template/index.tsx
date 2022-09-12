import React from 'react';
//import {MediaTemplate as MediaTemplateModel} from '../../../MetaModel';
import styles from './index.module.scss';

type TemplateProps = {
  //template: MediaTemplateModel;
};

export const WhatsAppTemplate = ({}: WhatsAppTemplateProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.media} ${buttons ? styles.mediaBorder : ''}`}>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer">
            see the {media_type} on Meta
          </a>
        )}

        {attachment_id && <span className={styles.mediaInfo}> {media_type} posted on Meta</span>}
      </div>
      {buttons && <Buttons buttons={buttons} mediaTemplate={true} />}
    </div>
  );
};