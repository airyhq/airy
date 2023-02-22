import React, {Dispatch, SetStateAction, useCallback, useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ListenOutsideClick} from '../ListenOutsideClick';
import {SearchField} from 'components/inputs';
import {useTranslation} from 'react-i18next';
import {Tooltip} from 'components/tooltip';
import {useAnimation} from 'components/services/useAnimation';
import {FilterDropdown} from './FilterDropdown';

export enum FilterTypes {
  all = 'all',
  installed = 'installed',
  comingSoon = 'comingSoon',
  notInstalled = 'notInstalled',
}

type FilterBarProps = {
  currentFilter: FilterTypes;
  setQuery?: (query: string) => void;
  items: {
    name: string;
    filter: FilterTypes;
    setFilter: Dispatch<SetStateAction<FilterTypes>>;
  }[];
  catalogAttributeFilter: string[];
  setAttributeFilter: Dispatch<SetStateAction<string>>;
};

export const FilterBar = (props: FilterBarProps) => {
  const {items, currentFilter, catalogAttributeFilter, setAttributeFilter} = props;
  const {t} = useTranslation();
  const [showSearchField, setShowingSearchField] = useState(false);
  const [animationActionSearchfield, setAnimationActionSearchfield] = useState(false);
  const [query, setQuery] = useState('');

  const showSearchFieldToggle = useCallback(() => {
    useAnimation(showSearchField, setShowingSearchField, setAnimationActionSearchfield, 300);
    setQuery('');
    props.setQuery('');
  }, [showSearchField, setShowingSearchField]);

  const Items = () => {
    return (
      <div className={styles.itemsContainer}>
        {items.map(item => (
          <Tooltip
            key={item.filter}
            right={item.filter === FilterTypes.all && 115}
            delay={1500}
            hoverElement={
              <div
                key={item.filter}
                onClick={() => {
                  item.setFilter(item.filter);
                  localStorage.setItem('catalogCurrentTypeFilter', item.filter);
                }}
              >
                <div className={styles.item}>{item.name}</div>
                <div className={currentFilter === item.filter ? styles.itemActive : undefined} />
              </div>
            }
            hoverElementWidth={200}
            hoverElementHeight={30}
            tooltipContent={t(`${item.filter}CatalogFilter`)}
            direction={item.filter === FilterTypes.all ? 'topRight' : 'top'}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className={styles.itemSearchContainer}>
        <Items />
        <div className={styles.filterContainer}>
          <div className={styles.filterDropdown}>
            <FilterDropdown
              text={'Filter'}
              catalogAttributeFilter={catalogAttributeFilter}
              onClick={(option: string) => {
                setAttributeFilter(option);
              }}
            />
          </div>
        </div>
        {showSearchField ? (
          <ListenOutsideClick onOuterClick={showSearchFieldToggle}>
            <SearchField
              autoFocus
              animation={animationActionSearchfield ? styles.animateIn : styles.animateOut}
              className={styles.searchField}
              placeholder={t('searchByNamePlaceholder')}
              value={query}
              setValue={(value: string) => {
                setQuery(value);
                props.setQuery(value);
              }}
            />
          </ListenOutsideClick>
        ) : (
          <Tooltip
            hoverElement={
              <SearchIcon height={20} width={20} className={styles.searchIcon} onClick={showSearchFieldToggle} />
            }
            hoverElementWidth={20}
            hoverElementHeight={20}
            tooltipContent={t('searchComponent')}
            direction={'topLeft'}
          />
        )}
      </div>
      <div className={styles.line} />
    </div>
  );
};
