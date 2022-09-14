import React from 'react';
import { WhatsAppMediaType } from '../../../MetaModel';
import { WhatsAppMediaContent } from '../WhatsAppMedia';
import styles from './index.module.scss';

type WhatsAppTemplateProps = {
  template: any;
};

export const WhatsAppTemplate = ({template}: WhatsAppTemplateProps) => {
  console.log('compo template', template);
  console.log('compo components', template?.components);

  return (
    <section className={styles.wrapper}>
      {template?.components &&
        template?.components.map(item => {
          console.log('item', item);
          return (
            <div className={styles[item.type]}>
              <>
                {item.parameters.map(parameter => {
                  let content;

                    console.log('parameter', parameter);

                    {parameter.type in WhatsAppMediaType && (content = <WhatsAppMediaContent mediaType={parameter.type} link={parameter[parameter.type].link} caption={parameter[parameter.type]?.caption} />)}

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
