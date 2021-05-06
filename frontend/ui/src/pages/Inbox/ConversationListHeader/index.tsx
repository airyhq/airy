import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';

import {SearchField} from 'components';
import {StateModel} from '../../../reducers';

import {setSearch, resetFilteredConversationAction} from '../../../actions/conversationsFilter';

import {ReactComponent as IconSearch} from 'assets/images/icons/search.svg';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {ReactComponent as FilterIcon} from 'assets/images/icons/filter-alt.svg';

import styles from './index.module.scss';

import {cySearchButton, cySearchField, cySearchFieldBackButton} from 'handles';
import Popup from '../ConversationsFilter/Popup';

const mapDispatchToProps = {
  setSearch,
  resetFilteredConversationAction,
};

const mapStateToProps = (state: StateModel) => ({
  user: state.data.user,
  currentFilter: state.data.conversations.filtered.currentFilter || {},
  totalConversations: state.data.conversations.all.paginationData.total,
  filteredPaginationData: state.data.conversations.filtered.paginationData,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConversationListHeaderProps = {
  onFilterVisibilityChanged: () => void;
} & ConnectedProps<typeof connector> &
  RouteComponentProps;

const ConversationListHeader = (props: ConversationListHeaderProps) => {
  const {setSearch, resetFilteredConversationAction, currentFilter, onFilterVisibilityChanged} = props;

  const [isShowingSearchInput, setIsShowingSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  let amountFiltersSet = 0;

  useEffect(() => {
    resetFilteredConversationAction();
  }, [resetFilteredConversationAction]);

  const onClickSearch = () => {
    if (isShowingSearchInput) {
      setSearch(currentFilter, null);
    }
    setIsShowingSearchInput(!isShowingSearchInput);
  };

  const onClickBack = () => {
    setSearch(currentFilter, null);
    setIsShowingSearchInput(!isShowingSearchInput);
    setSearchText('');
  };

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
      <div className={styles.headline}>{`Inbox (${filteredPaginationData.filteredTotal ?? totalConversations})`}</div>
    );
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    onFilterVisibilityChanged();
  };

  const activeFilter = () => {
    const currentFilterLength = Object.keys(currentFilter).length;

    if (currentFilterLength > 0) {
      if (currentFilter?.byChannels?.length > 0) {
        amountFiltersSet += 1;
      }
      if (currentFilter?.bySources?.length > 0) {
        amountFiltersSet += 1;
      }
      if (currentFilter?.byTags?.length > 0) {
        amountFiltersSet += 1;
      }
      if (currentFilter?.displayName?.length > 0 && currentFilter.displayName === undefined) {
        amountFiltersSet += 1;
      }
      if (currentFilter.isStateOpen === true || currentFilter.isStateOpen === false) {
        amountFiltersSet += 1;
      }
      if (currentFilter.readOnly === true || currentFilter.readOnly === false) {
        amountFiltersSet += 1;
      }
      if (currentFilter.unreadOnly === true || currentFilter.unreadOnly === false) {
        amountFiltersSet += 1;
      }
      if (
        (currentFilter.readOnly === true && currentFilter.unreadOnly === false) ||
        (currentFilter.readOnly === false && currentFilter.unreadOnly === true)
      ) {
        amountFiltersSet -= 1;
      }
    }
    return amountFiltersSet;
  };

  const renderSearchInput = isShowingSearchInput ? (
    <div className={styles.containerSearchField}>
      <button type="button" className={styles.backButton} onClick={onClickBack} data-cy={cySearchFieldBackButton}>
        <BackIcon className={styles.backIcon} />
      </button>
      <div className={styles.searchFieldWidth}>
        <SearchField
          placeholder="Search"
          value={searchText}
          setValue={setValue}
          resetClicked={onClickSearch}
          autoFocus={true}
          dataCy={cySearchField}
        />
      </div>
    </div>
  ) : (
    <div className={styles.containerSearchHeadline}>
      <InboxConversationCount />
      <div className={styles.searchBox} data-cy={cySearchButton}>
        <button type="button" className={styles.searchButton} onClick={onClickSearch}>
          <IconSearch className={styles.searchIcon} title="Search" />
        </button>
        <button
          title="Filter"
          id="filterButton"
          className={`${activeFilter() > 0 ? styles.activeFilters : styles.filterButton}`}
          onClick={() => toggleFilter()}>
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
