import React from 'react';
//import {MediaTemplate as MediaTemplateModel} from '../../../MetaModel';
import styles from './index.module.scss';
import {ImageWithFallback} from '../../../../../components';

type WhatsAppTemplateProps = {
  template: any;
  components:any;
  fromContact:any;
};

export const WhatsAppTemplate = ({template, components, fromContact}: WhatsAppTemplateProps) => {
  return (
    <section className={styles.wrapper}>
      {components && components.map(item => {
        {item.type === 'header' && (

          <div>
            <>
          {item.parameters.map(parameter => {
            {parameter.type ==='image' && (
              <ImageWithFallback src={parameter.image.link}/>
            )}
            {parameter.type ==='text' && (
              <h1>{parameter.text}</h1>
            )}

            {parameter.type ==='button' && (
              <h1>{parameter.text}</h1>
            )}
          })}
          </>
          </div>
        )}
      })}
     
    </section>
  );
};