import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {filter} from 'lodash-es';
import {ConversationFilter} from 'model';

import {StateModel} from '../../../reducers';

import {setFilter, resetFilter} from '../../../actions/conversationsFilter';
import {allConversations, isFilterActive} from '../../../selectors/conversations';

import styles from './index.module.scss';

const mapStateToProps = (state: StateModel) => {
  return {
    conversationsFilter: state.data.conversations.filtered.currentFilter,
    isFilterActive: isFilterActive(state),
    filteredPaginationData: state.data.conversations.filtered.paginationData,
    conversations: allConversations(state),
  };
};

const mapDispatchToProps = {
  setFilter,
  resetFilter,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConversationsFilterProps = {} & ConnectedProps<typeof connector>;

const ConversationsFilter = (props: ConversationsFilterProps) => {
  const {conversationsFilter, setFilter} = props;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilterState, setCurrentFilterState] = useState('ALL');

  useEffect(() => {
    resetFilter();
    itemsCount();
    currentStateFilter()
  }),
    [props.conversations];

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
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

  const currentStateFilter = () => {
    const allButton = document.getElementById('allButton')
    const openButton = document.getElementById('openButton')
    const closedButton = document.getElementById('closedButton')

    switch (currentFilterState) {
      case 'ALL':
        allButton.className = styles.quickFilterButtonActive;
        openButton.className = styles.quickFilterButton;
        closedButton.className = styles.quickFilterButton;
        break;
      case 'OPEN':
        allButton.className = styles.quickFilterButton;
        openButton.className = styles.quickFilterButtonActive;
        closedButton.className = styles.quickFilterButton;
        break;
      case 'CLOSED':
        allButton.className = styles.quickFilterButton;
        openButton.className = styles.quickFilterButton;
        closedButton.className = styles.quickFilterButtonActive;
        break;
    }
  };

  const itemsCount = () => {
    const {filteredPaginationData} = props;

    if (
      filteredPaginationData.filteredTotal !== undefined &&
      filteredPaginationData.filteredTotal !== filteredPaginationData.total
    ) {
      return (
        <div className={styles.filterCount}>
          {`Filtered: ${filteredPaginationData.filteredTotal} Total: ${props.conversations.length}`}
        </div>
      );
    }

    return <div className={styles.filterCount}>&nbsp;</div>;
  };

  return (
    <div>
      {itemsCount()}
      <div className={styles.quickFilterContainer}>
        <div className={styles.quickFilterButtons}>
          <div className={styles.quickFilterButtonsBackground}>
            <button id="allButton" className={styles.quickFilterButton} onClick={() => setCurrentFilterState('ALL')}>
              All
            </button>
            <button id="openButton" className={styles.quickFilterButton} onClick={() => setCurrentFilterState('OPEN')}>
              Open
            </button>
            <button id="closedButton" className={styles.quickFilterButton} onClick={() => setCurrentFilterState('CLOSED')}>
              Closed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(ConversationsFilter);
