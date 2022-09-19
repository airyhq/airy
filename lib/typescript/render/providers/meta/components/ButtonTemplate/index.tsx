import React from 'react';
import {Buttons} from '../Buttons';

import {ButtonTemplate as ButtonTemplateModel} from '../../MetaModel';

import styles from './index.module.scss';

type ButtonTemplateRendererProps = {
  template: ButtonTemplateModel;
};

export const ButtonTemplate = ({template}: ButtonTemplateRendererProps) => (
  <div className={styles.wrapper}>
    <div className={styles.template}>
      <div className={styles.tempateText}>{template.text}</div>
      <Buttons buttons={template.buttons} />
    </div>
  </div>
);
