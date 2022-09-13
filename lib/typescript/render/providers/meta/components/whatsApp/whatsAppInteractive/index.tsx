import React from 'react';
import {
  WhatsAppInteractiveType,
  WhatsAppInteractiveHeader,
  WhatsAppMediaType,
} from '../../../MetaModel';
import {  WhatsAppMediaContent} from '../';
import styles from './index.module.scss';

// button: Use it for Reply Buttons.
// list: Use it for List Messages.
// product: Use for Single Product Messages.
// product_list: Use for Multi-Product Messages.

//OR: is interactiveType needed for styling?

type WhatsAppInteractiveTypeProps = {
  interactiveType: WhatsAppInteractiveType; //this is actually not needed on our side (it's just for WA)
  header?: WhatsAppInteractiveHeader;
  body?: {text: string};
  footer?: {text: string};
};

export const WhatsAppInteractive = ({interactiveType, header, body, footer}: WhatsAppInteractiveTypeProps) => {
    console.log('interactive header', header);
    console.log('interactive footer', footer)
    console.log('interactibe body', body)
  return (
    <section className={styles.interactiveWrapper}>
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
          <p>{body.text}</p>
        </section>
      )}

      {footer && (
        <section className={styles.footer}>
          <p>{footer.text}</p>
        </section>
      )}
    </section>
  );
};
