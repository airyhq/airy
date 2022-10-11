import {Button} from 'components';
import React, {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import styles from './FilterCatalogModal.module.scss';

export enum FilterTypes {
  all = 'all',
  installed = 'installed',
  comingSoon = 'comingSoon',
  notInstalled = 'notInstalled',
}

type FilterCatalogModalProps = {
  currentFilter: FilterTypes;
  setCurrentFilter: Dispatch<SetStateAction<FilterTypes>>;
  setShowFilter: Dispatch<SetStateAction<boolean>>;
  animation: string;
};

export const FilterCatalogModal = (props: FilterCatalogModalProps) => {
  const [currentFilter, setCurrentFilter] = useState(props.currentFilter || FilterTypes.all);
  const {t} = useTranslation();
  const darkModeOn = localStorage.getItem('theme') === 'dark';

  const applyFilter = () => {
    props.setCurrentFilter(currentFilter);
    props.setShowFilter(false);
    localStorage.setItem('catalogCurrentTypeFilter', currentFilter);
  };

  const clearFilter = () => {
    setCurrentFilter(FilterTypes.all);
    props.setCurrentFilter(FilterTypes.all);
    localStorage.setItem('catalogCurrentTypeFilter', currentFilter);
  };

  return (
    <div className={`${styles.container} ${props.animation}`}>
      <div className={styles.titleContainer}>
        <h1>{t('searchByType')}</h1>
        <CloseIcon className={styles.closeIcon} height={12} width={12} onClick={() => props.setShowFilter(false)} />
      </div>
      <div className={darkModeOn ? styles.filterTypesDarkMode : styles.filterTypes}>
        <Button
          className={currentFilter === FilterTypes.all ? styles.activeButton : ''}
          onClick={() => setCurrentFilter(FilterTypes.all)}
        >
          {t('all')}
        </Button>
        <Button
          className={currentFilter === FilterTypes.installed && styles.activeButton}
          onClick={() => setCurrentFilter(FilterTypes.installed)}
        >
          {t('installed')}
        </Button>
        <Button
          className={currentFilter === FilterTypes.comingSoon && styles.activeButton}
          onClick={() => setCurrentFilter(FilterTypes.comingSoon)}
        >
          {t('comingSoon')}
        </Button>
        <Button
          className={currentFilter === FilterTypes.notInstalled && styles.activeButton}
          onClick={() => setCurrentFilter(FilterTypes.notInstalled)}
        >
          {t('notInstalled')}
        </Button>
      </div>
      <div className={styles.line} />
      <div className={styles.actionButtons}>
        <Button onClick={clearFilter} styleVariant="text" className={styles.clearAllButton}>
          {t('clearAll')}
        </Button>
        <Button onClick={applyFilter}>{t('apply')}</Button>
      </div>
    </div>
  );
};
