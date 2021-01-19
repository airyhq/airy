import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {filter} from 'lodash-es';

import {ConversationFilter, ConversationStateEnum} from 'httpclient';
import {StateModel} from '../../../reducers';

import {setFilter, resetFilter} from '../../../actions/conversationsFilter';
import {isFilterActive} from '../../../selectors/conversations';

import {ReactComponent as ChevronLeft} from '../../../assets/images/icons/chevron_left.svg';
import Popup from './Popup';

import styles from './index.module.scss';

const mapStateToProps = (state: StateModel) => {
  return {
    conversationsFilter: state.data.conversations.filtered.currentFilter,
    isFilterActive: isFilterActive(state),
    conversationsMetadata: state.data.conversations.all.metadata,
    filteredMetadata: state.data.conversations.filtered.metadata,
  };
};

const mapDispatchToProps = {
  setFilter,
  resetFilter,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConversationsFilterProps = {
  onFilterVisibilityChanged: () => void;
} & ConnectedProps<typeof connector>;

const ConversationsFilter = (props: ConversationsFilterProps) => {
  const {conversationsFilter, setFilter, onFilterVisibilityChanged} = props;

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    resetFilter();
  });

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    onFilterVisibilityChanged();
  };

  const getActiveFilterCount = () => {
    return filter(Object.keys(conversationsFilter), (element: string) => {
      return element !== 'displayName';
    }).length;
  };

  const isOnlyOneFilterActive = () => {
    return getActiveFilterCount() === 1;
  };

  const isFilterOpenActive = () => {
    return conversationsFilter.state === 'OPEN' && isOnlyOneFilterActive();
  };

  const isFilterUnreadActive = () => {
    return conversationsFilter.minUnreadMessageCount > 0 && isOnlyOneFilterActive();
  };

  const isFilterButtonActive = () => {
    return (
      getActiveFilterCount() > 1 ||
      conversationsFilter.state === 'CLOSED' ||
      conversationsFilter.maxUnreadMessageCount === 0 ||
      (conversationsFilter.contactTagIds && conversationsFilter.contactTagIds.length > 0) ||
      (conversationsFilter.channelIds && conversationsFilter.channelIds.length > 0)
    );
  };

  const activateUnreadFilter = () => {
    resetFilter();
    setFilter({minUnreadMessageCount: 1});
  };

  const activateOpenFilter = () => {
    resetFilter();
    setFilter({state: ConversationStateEnum.open});
  };

  const renderFilterStatus = () => {
    const activeFilters = [];
    if (conversationsFilter.maxUnreadMessageCount === 0) {
      activeFilters.push('Read');
    }
    if (conversationsFilter.minUnreadMessageCount === 1) {
      activeFilters.push('Unread');
    }
    if (conversationsFilter.state) {
      activeFilters.push(conversationsFilter.state === 'OPEN' ? 'Open' : 'Done');
    }
    if (conversationsFilter.contactTagIds && conversationsFilter.contactTagIds.length > 0) {
      activeFilters.push('Tags', {count: conversationsFilter.contactTagIds.length});
    }
    if (conversationsFilter.channelIds && conversationsFilter.channelIds.length > 0) {
      activeFilters.push('Channels', {count: conversationsFilter.channelIds.length});
    }

    return (
      <div className={styles.filterHintRow}>
        {activeFilters.map((filter, key) => {
          return (
            <div key={key} className={styles.filterHint} onClick={toggleFilter}>
              {filter}
            </div>
          );
        })}
      </div>
    );
  };

  const itemsCount = () => {
    const {conversationsMetadata, filteredMetadata} = props;
    const formatter = new Intl.NumberFormat('en-US');

    if (filteredMetadata.loaded) {
      return (
        <div className={styles.filterCount}>
          "messenger.filter.countFiltered"
          {/* {
            formatter.format(filteredMetadata.filtered_total),
            formatter.format(conversationsMetadata.total) */}
        </div>
      );
    }

    if (conversationsMetadata.total) {
      return (
        <div className={styles.filterCount}>
          "messenger.filter.countUnfiltered"
          {formatter.format(filteredMetadata.filteredTotal || conversationsMetadata.total)}
        </div>
      );
    }

    return <div className={styles.filterCount}>&nbsp;</div>;
  };

  return (
    <div>
      {itemsCount()}
      <div className={styles.actionRow}>
        {isFilterButtonActive() ? (
          renderFilterStatus()
        ) : (
          <div>
            <button
              onClick={() => resetFilter()}
              className={`${styles.shortcutButton} ${!isFilterActive ? styles.shortcutButtonActive : ''}`}>
              All
            </button>
            <button
              onClick={activateUnreadFilter}
              className={`${styles.shortcutButton} ${isFilterUnreadActive() ? styles.shortcutButtonActive : ''}`}>
              Unread
            </button>
            <button
              onClick={activateOpenFilter}
              className={`${styles.shortcutButton} ${isFilterOpenActive() ? styles.shortcutButtonActive : ''}`}>
              Open
            </button>
          </div>
        )}
        <button className={styles.filterButton} onClick={toggleFilter}>
          <span>Filter</span>
          <ChevronLeft aria-hidden className={`${styles.chevron} ${isFilterOpen ? styles.chevronOpen : ''}`} />
        </button>
      </div>
      {isFilterOpen && <Popup closeCallback={toggleFilter} />}
    </div>
  );
};

export default connector(ConversationsFilter);
