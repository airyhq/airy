import React from 'react';
import Linkify from 'linkify-react';
import ReactMarkdown from 'react-markdown';
import {WhatsAppInteractiveHeader, WhatsAppMediaType, WhatsAppInteractiveAction} from '../../../MetaModel';
import {WhatsAppMediaContent} from '..';
import {ReactComponent as ProductListIcon} from 'assets/images/icons/productList.svg';
import styles from './index.module.scss';

type WhatsAppInteractiveTypeProps = {
  action: WhatsAppInteractiveAction;
  header?: WhatsAppInteractiveHeader;
  body?: {text: string};
  footer?: {text: string};
};

export const WhatsAppInteractive = ({action, header, body, footer}: WhatsAppInteractiveTypeProps) => {
  return (
    <section>
      <section className={styles.interactiveContent}>
        {header && (
          <section className={styles.header}>
            {header && header.type in WhatsAppMediaType && (
              <WhatsAppMediaContent
                mediaType={header.type as WhatsAppMediaType}
                link={header[header.type as WhatsAppMediaType].link}
                caption={header[header.type as WhatsAppMediaType].caption}
              />
            )}
            {header && header.type === 'text' && <h1>{header.text}</h1>}
          </section>
        )}

        {body && (
          <section className={styles.body}>
            <p>
              {' '}
              <ReactMarkdown skipHtml={true} linkTarget={'_blank'}>
                {body.text}
              </ReactMarkdown>
            </p>
          </section>
        )}

        {footer && (
          <section className={styles.footer}>
            {footer.text.startsWith('https') || footer.text.startsWith('http') ? (
              <Linkify
                tagName="p"
                options={{
                  defaultProtocol: 'https',
                  className: `${styles.footerLink}`,
                  target: '_blank',
                }}
              >
                {footer.text}
              </Linkify>
            ) : (
              <ReactMarkdown skipHtml={true} linkTarget={'_blank'}>
                {footer.text}
              </ReactMarkdown>
            )}
          </section>
        )}

        {action && action?.button && (
          <section className={styles.actionButton}>
            <ProductListIcon />
            <h2>{action.button}</h2>
          </section>
        )}
      </section>

      {action &&
        action?.buttons &&
        action.buttons.map(replyButton => {
          return (
            <section className={styles.actionReplyButton} key={replyButton.reply.title}>
              <h2>{replyButton.reply.title}</h2>
            </section>
          );
        })}
    </section>
  );
};
