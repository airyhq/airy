import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {CatalogSearchBar} from '../../../../../frontend/control-center/src/pages/Catalog/CatalogSearchBar/CatalogSearchBar';
import {ListenOutsideClick} from '../ListenOutsideClick';
import {SearchField} from 'components/inputs';
import {useTranslation} from 'react-i18next';
import {useAnimation} from 'render';

export enum FilterTypes {
  all = 'all',
  installed = 'installed',
  comingSoon = 'comingSoon',
  notInstalled = 'notInstalled',
}

type FilterBarProps = {
  setQuery: Dispatch<SetStateAction<string>>;
  items: {
    name: string;
    filter: FilterTypes;
    setFilter: Dispatch<SetStateAction<FilterTypes>>;
  }[];
};

export const FilterBar = (props: FilterBarProps) => {
  const {items} = props;
  const {t} = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterTypes>(FilterTypes.all);
  const [showSearchField, setShowingSearchField] = useState(false);
  const [animationActionSearchfield, setAnimationActionSearchfield] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    props.setQuery(query);
  }, [query]);

  const showSearchFieldToggle = useCallback(() => {
    useAnimation(showSearchField, setShowingSearchField, setAnimationActionSearchfield, 300);
    setQuery('');
    props.setQuery('');
  }, [showSearchField, setShowingSearchField]);

  const Items = () => {
    return (
      <div className={styles.itemsContainer}>
        {items.map(item => (
          <div
            key={item.filter}
            onClick={() => {
              setActiveFilter(item.filter);
              item.setFilter(item.filter);
            }}>
            <div className={styles.item}>{item.name}</div>
            <div className={activeFilter === item.filter ? styles.itemActive : styles.itemInactive} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.itemSearchContainer}>
        <Items />
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
      </div>
    </div>
  );
};
