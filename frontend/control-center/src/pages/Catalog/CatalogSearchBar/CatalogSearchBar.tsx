import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as FilterIcon} from 'assets/images/icons/filterAlt.svg';
import styles from './CatalogSearchBar.module.scss';
import {ListenOutsideClick, SearchField} from 'components';
import {useTranslation} from 'react-i18next';
import {FilterCatalogModal, FilterTypes} from './FilterCatalogModal/FilterCatalogModal';
import {useAnimation} from 'render';

type CatalogSearchBarProps = {
  currentFilter: FilterTypes;
  setCurrentFilter: Dispatch<SetStateAction<FilterTypes>>;
  setQuery: Dispatch<SetStateAction<string>>;
};

export const CatalogSearchBar = (props: CatalogSearchBarProps) => {
  const {t} = useTranslation();
  const [query, setQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState(props.currentFilter);
  const [showSearchField, setShowingSearchField] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [animationAction, setAnimationAction] = useState(false);
  const [animationActionSearchfield, setAnimationActionSearchfield] = useState(false);

  const toggleShowFilter = useCallback(() => {
    useAnimation(showFilter, setShowFilter, setAnimationAction, 500);
  }, [showFilter, setShowFilter]);

  const showSearchFieldToggle = useCallback(() => {
    useAnimation(showSearchField, setShowingSearchField, setAnimationActionSearchfield, 300);
    setQuery('');
    props.setQuery('');
  }, [showSearchField, setShowingSearchField]);

  useEffect(() => {
    props.setCurrentFilter(currentFilter);
  }, [currentFilter]);

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        {showSearchField ? (
          <ListenOutsideClick onOuterClick={showSearchFieldToggle}>
            <SearchField
              autoFocus
              animation={animationActionSearchfield ? styles.animateIn : styles.animateOut}
              className={styles.searchField}
              placeholder={t('searchByNamePlaceholder')}
              value={query}
              setValue={(value: string) => {
                setQuery(value), props.setQuery(value);
              }}
            />
          </ListenOutsideClick>
        ) : (
          <SearchIcon height={20} width={20} className={styles.searchIcon} onClick={showSearchFieldToggle} />
        )}
        <FilterIcon
          height={24}
          width={24}
          className={
            currentFilter !== FilterTypes.all ? `${styles.filterIcon} ${styles.filterIconSelected}` : styles.filterIcon
          }
          onClick={toggleShowFilter}
        />
        <div>
          {showFilter && (
            <ListenOutsideClick onOuterClick={showFilter && toggleShowFilter}>
              <FilterCatalogModal
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
                setShowFilter={toggleShowFilter}
                animation={`${styles.filterModal} ${
                  animationAction ? styles.filterModalAnimIn : styles.filterModalAnimOut
                }`}
              />
            </ListenOutsideClick>
          )}
        </div>
      </div>
    </div>
  );
};
