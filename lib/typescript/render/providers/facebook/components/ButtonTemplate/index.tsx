import React from 'react';
import styles from './index.module.scss';
import {ButtonTemplate as ButtonTemplateModel} from '../../facebookModel';

type ButtonTemplateRendererProps = {
  template: ButtonTemplateModel;
};

export const ButtonTemplate = ({template}: ButtonTemplateRendererProps) => (
  <div className={styles.wrapper}>
    <div className={styles.template}>
      <div className={styles.tempateText}>{template.text}</div>
      {template.buttons.map((button, idx) => {
        return (
          <div key={`button-${idx}`} className={styles.button}>
            {button.type == 'web_url' && button.url.length ? (
              <a href={button.url} target="_blank" rel="noreferrer" className={styles.buttonText}>
                {button.title}
              </a>
            ) : (
              <div className={styles.buttonText}>{button.title}</div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
