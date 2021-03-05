import React from 'react';
import Linkify from 'linkifyjs/react';

import styles from './TextTemplate.module.scss';

type Props = {
  styleVariant?;
  isMember;
  template?: any;
};

export const TextTemplate = ({styleVariant, isMember, template}: Props) => {
  const mapStyleToCss = {
    single: styles.single,
    top: styles.top,
    middle: styles.middle,
    bottom: styles.bottom,
  };

  const cssClasses = `${template && template.payload ? styles.messageStyleShadow : styles.messageStyle} ${
    isMember ? styles.isMember : ''
  }`;

  return (
    <div className={cssClasses}>
      <Linkify
        tagName="div"
        className="text-content"
        options={{
          defaultProtocol: 'https',
          className: 'message-link',
        }}>
        {template.payload}
      </Linkify>
    </div>
  );
};
