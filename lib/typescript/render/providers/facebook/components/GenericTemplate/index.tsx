import React from 'react';
import {Carousel} from 'components';
import styles from './index.module.scss';
import {GenericTemplate as GenericTemplateModel} from '../../facebookModel';
import {ImageWithFallback} from 'render/components/ImageWithFallback';

type GenericTemplateRendererProps = {
  template: GenericTemplateModel;
};

export const GenericTemplate = ({template}: GenericTemplateRendererProps) => {
  return (
    <Carousel>
      {template.elements.map((element, idx) => (
        <div key={`template-${idx}`} className={styles.template}>
          {element.image_url?.length && <ImageWithFallback className={styles.templateImage} src={element.image_url} />}
          <div className={styles.innerTemplate}>
            <div className={styles.templateTitle}>{element.title}</div>
            <div className={styles.templateSubtitle}>{element.subtitle}</div>
            {element.buttons.map((button, idx) => {
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
      ))}
    </Carousel>
  );
};
