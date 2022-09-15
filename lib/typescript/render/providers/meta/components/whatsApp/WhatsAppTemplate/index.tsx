import React from 'react';
import Linkify from 'linkify-react';
import {WhatsAppMediaType, WhatsAppComponents, WhatsAppParameter, WhatsAppButton} from '../../../MetaModel';
import {WhatsAppMediaContent} from '../WhatsAppMedia';
import styles from './index.module.scss';

type WhatsAppTemplateProps = {
  components: WhatsAppComponents[];
};

export const WhatsAppTemplate = ({components}: WhatsAppTemplateProps) => {
  return (
    <section className={styles.wrapper}>
      {components &&
        components.map((item, index) => {
          return (
            <div key={index} className={styles[item.type]}>
              <>
                {item.parameters.map((parameter: WhatsAppParameter | WhatsAppButton) => {
                  let content;

                  {
                    parameter.type in WhatsAppMediaType &&
                      (content = (
                        <WhatsAppMediaContent
                          mediaType={parameter.type as WhatsAppMediaType}
                          link={parameter[parameter.type].link}
                          caption={parameter[parameter.type]?.caption}
                        />
                      ));
                  }

                  {
                    parameter.type === 'text' && (content = <p>{parameter.text}</p>);
                  }

                  {
                    item.type === 'button' &&
                      'text' in parameter &&
                      (content = (
                        <Linkify
                          tagName="p"
                          options={{
                            defaultProtocol: 'https',
                            className: `${styles.buttonURL}`,
                            target: '_blank',
                          }}
                        >
                          {parameter.text}
                        </Linkify>
                      ));
                  }

                  {
                    item.type === 'button' && 'payload' in parameter && (content = <p>{parameter['payload']}</p>);
                  }

                  {
                    parameter.type === 'currency' &&
                      (content = (
                        <p>
                          {parameter.currency?.amount_1000 && parameter.currency?.code
                            ? `${parseInt(parameter.currency.amount_1000) / 1000} ${parameter.currency?.code}`
                            : `${parameter?.currency?.fallback_value}`}
                        </p>
                      ));
                  }

                  {
                    parameter.type === 'date_time' && (content = <p> {parameter.date_time.fallback_value}</p>);
                  }

                  return (
                    <div className={styles.contentTemplate} key={parameter.type + item.type}>
                      {content}
                    </div>
                  );
                })}
              </>
            </div>
          );
        })}
    </section>
  );
};
