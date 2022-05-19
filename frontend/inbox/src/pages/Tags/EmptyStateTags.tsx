import React from 'react';
import {Button} from 'components';
import {ReactComponent as EmptyImage} from 'assets/images/emptyState/tagsEmptyState.svg';
import styles from './EmptyStateTags.module.scss';
import {useTranslation} from 'react-i18next';

interface EmptyStateTagsProps {
  removeEmptyState(): void;
}

const EmptyStateTags = (props: EmptyStateTagsProps) => {
  const {t} = useTranslation();
  return (
    <div className={styles.cardRaised}>
      <div className={styles.emptyStateTitle}>
        <h1>{t('noTagsYet')}</h1>
        <p>{t('tagsExplanation')}</p>
        <EmptyImage className={styles.emptyImage} />
        <Button onClick={props.removeEmptyState}>{t('createATag')}</Button>
      </div>
    </div>
  );
};

export default EmptyStateTags;
