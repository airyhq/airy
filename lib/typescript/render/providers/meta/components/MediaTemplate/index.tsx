import React from 'react';
import {MediaTemplate as MediaTemplateModel} from '../../MetaModel';
import {Buttons} from '../Buttons';
import styles from './index.module.scss';

type MediaTemplateProps = {
  template: MediaTemplateModel;
};

export const MediaTemplate = ({template: {media_type, url, attachment_id, buttons}}: MediaTemplateProps) => {
  return (
    <div className={styles.mediaTemplate}>
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
