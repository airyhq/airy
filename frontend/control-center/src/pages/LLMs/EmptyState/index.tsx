import React, {Dispatch, SetStateAction} from 'react';
import styles from './index.module.scss';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {useTranslation} from 'react-i18next';

type EmptyStateProps = {
  createNewLLM: Dispatch<SetStateAction<boolean>>;
};

export const EmptyState = (props: EmptyStateProps) => {
  const {createNewLLM} = props;
  const {t} = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.iconContainer}>
          <SearchIcon className={styles.searchIcon} />
        </div>
        <h1>{t('noLLMs')}</h1>
        <span>
          {t('noLLMsText')}
          <span onClick={() => createNewLLM(true)} className={styles.subscribeButton}>
            {t('create') + ' one'}
          </span>
        </span>
      </div>
    </div>
  );
};
