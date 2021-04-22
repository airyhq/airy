import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {filter} from 'lodash-es';

import {SearchField} from 'components';
import {StateModel} from '../../../reducers';

import {setSearch, resetFilteredConversationAction} from '../../../actions/conversationsFilter';
import {allConversations} from '../../../selectors/conversations';

import {ReactComponent as IconSearch} from 'assets/images/icons/search.svg';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {ReactComponent as FilterIcon} from 'assets/images/icons/filter-alt.svg';

import styles from './index.module.scss';

import {cySearchButton, cySearchField, cySearchFieldBackButton} from 'handles';
import Popup from '../ConversationsFilter/Popup';

const mapStateToProps = (state: StateModel) => {
  return {
    user: state.data.user,
    currentFilter: state.data.conversations.filtered.currentFilter || {},
    conversations: allConversations(state),
  };
};

const mapDispatchToProps = {
  setSearch,
  resetFilteredConversationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConversationListHeaderProps = {
  onFilterVisibilityChanged: () => void;
} & ConnectedProps<typeof connector>;

const ConversationListHeader = (props: ConversationListHeaderProps) => {
  const {setSearch, resetFilteredConversationAction, currentFilter, onFilterVisibilityChanged} = props;

  const [isShowingSearchInput, setIsShowingSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    const {conversations} = props;

    return <div className={styles.headline}>{`Inbox (${conversations.length})`}</div>;
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    onFilterVisibilityChanged();
  };

  const getActiveFilterCount = () => {
    return filter(Object.keys(currentFilter), (element: string) => {
      return element !== 'displayName';
    }).length;
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
          id="filterButton"
          className={`${getActiveFilterCount() > 0 ? styles.activeFilters : styles.filterButton}`}
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
