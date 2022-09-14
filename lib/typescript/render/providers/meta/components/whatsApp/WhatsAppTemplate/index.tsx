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
        components.map(item => {
          return (
            <div className={styles[item.type]}>
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
                          key={parameter[parameter.type].link}
                        />
                      ));
                  }

                  {
                    parameter.type === 'text' && (content = <p key={parameter.text}>{parameter.text}</p>);
                  }

                  {
                    item.type === 'button' &&
                      'text' in parameter &&
                      (content = (
                        <Linkify
                          key={parameter.text}
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
                    item.type === 'button' &&
                      'payload' in parameter &&
                      (content = <p key={parameter['payload']}>{parameter['payload']}</p>);
                  }

                  {
                    parameter.type === 'currency' &&
                      (content = (
                        <p key={parameter?.currency?.fallback_value}>
                          {parameter.currency?.amount_1000 && parameter.currency?.code
                            ? `${parseInt(parameter.currency.amount_1000) / 1000} ${parameter.currency?.code}`
                            : `${parameter?.currency?.fallback_value}`}
                        </p>
                      ));
                  }

                  {
                    parameter.type === 'date_time' &&
                      (content = <p key={parameter.date_time.fallback_value}> {parameter.date_time.fallback_value}</p>);
                  }

                  return <div className={styles.contentTemplate}>{content}</div>;
                })}
              </>
            </div>
          );
        })}
    </section>
  );
};
