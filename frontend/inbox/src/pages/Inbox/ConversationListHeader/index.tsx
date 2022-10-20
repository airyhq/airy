import React, {useCallback, useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {SearchField} from 'components';
import {StateModel} from '../../../reducers';

import {setSearch, resetFilteredConversationAction} from '../../../actions';

import {ReactComponent as IconSearch} from 'assets/images/icons/search.svg';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrowLeft.svg';
import {ReactComponent as FilterIcon} from 'assets/images/icons/filterAlt.svg';

import styles from './index.module.scss';

import {cySearchButton, cySearchField, cySearchFieldBackButton} from 'handles';
import Popup from '../QuickFilter/Popup';
import {formatConversationCount} from '../../../services/format/numbers';
import {useTranslation} from 'react-i18next';
import {useAnimation} from 'render';

const mapDispatchToProps = {
  setSearch,
  resetFilteredConversationAction,
};

const mapStateToProps = (state: StateModel) => ({
  currentFilter: state.data.conversations.filtered.currentFilter || {},
  totalConversations: state.data.conversations.all.paginationData.total,
  filteredPaginationData: state.data.conversations.filtered.paginationData,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConversationListHeaderProps = ConnectedProps<typeof connector>;

const ConversationListHeader = (props: ConversationListHeaderProps) => {
  const {setSearch, resetFilteredConversationAction, currentFilter} = props;
  const {t} = useTranslation();

  const [isShowingSearchInput, setIsShowingSearchInput] = useState(false);
  const [animationAction, setAnimationAction] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    resetFilteredConversationAction();
  }, [resetFilteredConversationAction]);

  const showSearchFieldToggle = useCallback(() => {
    useAnimation(isShowingSearchInput, setIsShowingSearchInput, setAnimationAction, 400);
    setSearchText('');
    setSearch(currentFilter, null);
  }, [isShowingSearchInput, setIsShowingSearchInput]);

  const handleSearch = (value: string) => {
    setSearch(currentFilter, value);
  };

  const setValue = (value: string) => {
    setSearchText(value);
    handleSearch(value);
  };

  const InboxConversationCount = () => {
    const {totalConversations, filteredPaginationData} = props;

    return (
      <div className={styles.headline}>{`Inbox (${
        filteredPaginationData.total === null
          ? formatConversationCount(totalConversations)
          : formatConversationCount(filteredPaginationData.total)
      })`}</div>
    );
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const isFilterActive = (): boolean => Object.values(currentFilter).length > 0;

  const renderSearchInput = isShowingSearchInput ? (
    <div className={styles.containerSearchField}>
      <button
        type="button"
        className={styles.backButton}
        onClick={showSearchFieldToggle}
        data-cy={cySearchFieldBackButton}
      >
        <BackIcon className={styles.backIcon} />
      </button>
      <SearchField
        className={styles.searchField}
        animation={animationAction ? styles.animateIn : styles.animateOut}
        placeholder={t('search')}
        value={searchText}
        setValue={setValue}
        resetClicked={() => setSearchText('')}
        autoFocus={true}
        dataCy={cySearchField}
      />
    </div>
  ) : (
    <div className={styles.containerSearchHeadline}>
      <InboxConversationCount />
      <div className={styles.searchBox}>
        <button type="button" className={styles.searchButton} onClick={showSearchFieldToggle} data-cy={cySearchButton}>
          <IconSearch className={styles.searchIcon} title={t('search')} />
        </button>
        <button
          title="Filter"
          id="filterButton"
          className={`${isFilterActive() ? styles.activeFilters : styles.filterButton}`}
          onClick={toggleFilter}
        >
          <FilterIcon />
        </button>
        {isFilterOpen && (
          <div className={styles.popup}>
            <Popup closeCallback={toggleFilter} />
          </div>
        )}
      </div>
    </div>
  );

  return <div className={styles.containerSearch}>{renderSearchInput}</div>;
};

export default connector(ConversationListHeader);
