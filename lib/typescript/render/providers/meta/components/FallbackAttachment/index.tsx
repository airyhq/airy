import React from 'react';
import {Text} from '../../../../components/Text';
import {Fallback} from '../../MetaModel';
import styles from './index.module.scss';

interface FallbackProps {
  content: Fallback;
  fromContact?: boolean;
}

export function FallbackAttachment({content, fromContact}: FallbackProps) {
  return (
    <div className={styles.wrapper}>
      {content.text && <Text text={content.text} />}

      {content.title && <Text fromContact={fromContact || false} text={content.title} />}

      {content.url && <Text fromContact={fromContact || false} text={content.url} />}
    </div>
  );
}
