import React from 'react';
//import {MediaTemplate as MediaTemplateModel} from '../../../MetaModel';
import styles from './index.module.scss';
import {ImageWithFallback, Video, File} from '../../../../../components';

type WhatsAppTemplateProps = {
  template: any;
  fromContact: any;
};

export const WhatsAppTemplate = ({template, fromContact}: WhatsAppTemplateProps) => {
  console.log('compo template', template);
  console.log('compo components', template?.components);
  console.log('fromContact', fromContact);

  return (
    <section className={styles.wrapper}>
      {template?.components &&
        template?.components.map(item => {
          console.log('item', item);

          return (
            <div className={styles[item.type]}>
              <>
                {item.parameters.map(parameter => {
                  let content = <div></div>;

                    console.log('parameter', parameter);

                    {parameter.type === 'image' && parameter?.image?.link && (content = <><ImageWithFallback src={parameter.image.link} /> {parameter?.image?.caption ? <p className={styles.caption}>{parameter.image.caption}</p> : null} </>)};

                    {parameter.type === 'video' && parameter?.video?.link && (content = <><Video videoUrl={parameter.video.link} /> {parameter?.video?.caption ? <p className={styles.caption}>{parameter.video.caption}</p> : null} </>)};

                    {parameter.type === 'document' && parameter?.document?.link && (content = <><File fileUrl={parameter.document.link} /> {parameter?.document?.caption ? <p className={styles.caption}>{parameter.document.caption}</p> : null} </>)};

                    {
                      parameter.type === 'text' && (content = <p>{parameter.text}</p>);
                    }
  
                    {
                      item.type === 'button' && (content = <p>{parameter?.text ?? parameter?.payload?.text ?? parameter?.payload}</p>);
                    }

                    {
                      parameter.type === 'currency' && (content = <p>{parameter.currency?.amount_1000 && parameter.currency?.code ? `${parameter.currency.amount_1000 / 1000} ${parameter.currency?.code}` : `${parameter?.currency?.fallback_value}`}</p>);
                    }

                    {
                      parameter.type === 'date_time' && (content = <p>{parameter.date_time.fallback_value}</p>);
                    }



                    return(<div className={styles.contentTemplate}>{content}</div>)
                  

                })}
              </>
            </div>
          );
        })}
    </section>
  );
};
