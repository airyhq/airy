import React from 'react';
import {Button} from 'components';
import {ReactComponent as EmptyImage} from 'assets/images/emptyState/tagsEmptyState.svg';
import styles from './EmptyStateTags.module.scss';

interface EmptyStateTagsProps {
  removeEmptyState(): void;
}

const EmptyStateTags = (props: EmptyStateTagsProps) => {
  return (
    <div className={styles.cardRaised}>
      <div className={styles.emptyStateTitle}>
        <h1>You don&#39;t have tags yet.</h1>
        <p>Tags provide a useful way to group related conversations together and to quickly filter and search them.</p>
        <EmptyImage className={styles.emptyImage} />
        <Button onClick={props.removeEmptyState}>Create a Tag</Button>
      </div>
    </div>
  );
};

export default EmptyStateTags;
