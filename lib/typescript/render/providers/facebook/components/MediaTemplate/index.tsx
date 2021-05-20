import React from 'react';
import {MediaTemplate as MediaTemplateModel} from '../../facebookModel';
import {Buttons} from '../Buttons';
import styles from './index.module.scss';

type MediaTemplateProps = {
  template: MediaTemplateModel;
};

export const MediaTemplate = ({template: {media_type, url, buttons}}: MediaTemplateProps) => {
  return (
    <div className={styles.mediaTemplate}>
      <div className={`${styles.media} ${buttons ? styles.mediaBorder : ''}`}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          see the {media_type} on Facebook
        </a>
      </div>
      {buttons && <Buttons buttons={buttons} mediaTemplate={true} />}
    </div>
  );
};
