import React from 'react';
import styles from './index.module.scss';

type EmptyStateProps = {
  item: {llm: string; vectorDatabase: string; llmModel: string};
};

export const LLMInfoItem = (props: EmptyStateProps) => {
  const {item} = props;

  return (
    <div className={styles.container}>
      <p>{item.llm}</p>
      <p>{item.vectorDatabase}</p>
      <p>{item.llmModel}</p>
    </div>
  );
};
