import React from 'react';

import {Carousel} from 'components';
import {GenericTemplate as GenericTemplateModel} from '../../facebookModel';
import {ImageWithFallback} from 'render/components/ImageWithFallback';
import {Buttons} from '../Buttons';

import styles from './index.module.scss';

type GenericTemplateRendererProps = {
  template: GenericTemplateModel;
};

export const GenericTemplate = ({template}: GenericTemplateRendererProps) => {
  return (
    <Carousel>
      {template.elements.map((element, idx) => (
        <div key={`template-${idx}`} className={styles.template}>
          {element.image_url?.length && (
            <ImageWithFallback className={styles.templateImage} src={element.image_url} isTemplate />
          )}
          <div className={styles.innerTemplate}>
            <div className={styles.templateTitle}>{element.title}</div>
            <div className={styles.templateSubtitle}>{element.subtitle}</div>
            <Buttons buttons={element.buttons} />
          </div>
        </div>
      ))}
    </Carousel>
  );
};
