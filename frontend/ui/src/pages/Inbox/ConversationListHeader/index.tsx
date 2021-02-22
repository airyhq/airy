import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {SearchField} from '@airyhq/components';
import {StateModel} from '../../../reducers';

import {setSearch, resetFilteredConversationAction} from '../../../actions/conversationsFilter';

import {ReactComponent as IconSearch} from 'assets/images/icons/search.svg';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';

import styles from './index.module.scss';

const mapStateToProps = (state: StateModel) => {
  return {
    user: state.data.user,
    currentFilter: state.data.conversations.filtered.currentFilter || {},
  };
};

const mapDispatchToProps = {
  setSearch,
  resetFilteredConversationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationListHeader = (props: ConnectedProps<typeof connector>) => {
  const {setSearch, resetFilteredConversationAction, currentFilter} = props;

  const [isShowingSearchInput, setIsShowingSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');

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

  const renderSearchInput = isShowingSearchInput ? (
    <div className={styles.containerSearchField}>
      <button type="button" className={styles.backButton} onClick={onClickBack}>
        <BackIcon className={styles.backIcon} />
      </button>
      <div className={styles.searchFieldWidth}>
        <SearchField
          placeholder="Search"
          value={searchText}
          setValue={setValue}
          resetClicked={onClickSearch}
          autoFocus={true}
        />
      </div>
    </div>
  ) : (
    <div className={styles.containerSearchHeadline}>
      <div className={styles.headline}>Inbox</div>
      <div className={styles.searchBox}>
        <button type="button" className={styles.searchButton} onClick={onClickSearch}>
          <IconSearch className={styles.searchIcon} title="Search" />
        </button>
      </div>
    </div>
  );

  return <div className={styles.containerSearch}>{renderSearchInput}</div>;
};

export default connector(ConversationListHeader);
