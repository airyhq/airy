import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {filter} from 'lodash-es';
import {ConversationFilter} from 'httpclient';

import {StateModel} from '../../../reducers';

import {setFilter, resetFilter} from '../../../actions/conversationsFilter';
import {isFilterActive} from '../../../selectors/conversations';

import {ReactComponent as ChevronLeft} from 'assets/images/icons/chevron_left.svg';
import Popup from './Popup';

import styles from './index.module.scss';

const mapStateToProps = (state: StateModel) => {
  return {
    conversationsFilter: state.data.conversations.filtered.currentFilter,
    isFilterActive: isFilterActive(state),
    conversationsPaginationData: state.data.conversations.all.paginationData,
    filteredPaginationData: state.data.conversations.filtered.paginationData,
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

  const isFilterUnreadActive = () => {
    return conversationsFilter.unreadOnly && isOnlyOneFilterActive();
  };

  const isFilterButtonActive = () => {
    return (
      getActiveFilterCount() > 1 ||
      conversationsFilter.unreadOnly ||
      (conversationsFilter.byTags && conversationsFilter.byTags.length > 0) ||
      (conversationsFilter.byChannels && conversationsFilter.byChannels.length > 0)
    );
  };

  const activateUnreadFilter = () => {
    resetFilter();
    const filter: ConversationFilter = {unreadOnly: true};
    setFilter(filter);
  };

  const renderFilterStatus = () => {
    const activeFilters = [];
    if (conversationsFilter.readOnly) {
      activeFilters.push('Read');
    }
    if (conversationsFilter.unreadOnly) {
      activeFilters.push('Unread');
    }
    if (conversationsFilter.byTags && conversationsFilter.byTags.length > 0) {
      activeFilters.push(`${conversationsFilter.byTags.length} Tags`);
    }
    if (conversationsFilter.byChannels && conversationsFilter.byChannels.length > 0) {
      activeFilters.push(`${conversationsFilter.byChannels.length} Channels`);
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
    const {conversationsPaginationData, filteredPaginationData} = props;
    const formatter = new Intl.NumberFormat('en-US');

    if (filteredPaginationData.loaded) {
      return (
        <div className={styles.filterCount}>
          {`Filtered: ${filteredPaginationData.filtered_total} Total: ${filteredPaginationData.total}`}
        </div>
      );
    }

    if (conversationsPaginationData.total) {
      return (
        <div className={styles.filterCount}>
          {`${formatter.format(
            filteredPaginationData.filtered_total || conversationsPaginationData.total
          )} Conversations`}
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
