import React, {useEffect, useRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {ConversationFilter} from 'model';

import {StateModel} from '../../../reducers';

import {setFilter} from '../../../actions/conversationsFilter';
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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConversationsFilterProps = {} & ConnectedProps<typeof connector>;

const ConversationsFilter = (props: ConversationsFilterProps) => {
  const {conversationsFilter, setFilter} = props;
  const allButton = useRef(null);
  const openButton = useRef(null);
  const closedButton = useRef(null);

  useEffect(() => {
    itemsCount();
    currentStateFilter();
  }),
    [props.conversations];

  const currentStateFilter = () => {
    allButton.current.className = styles.quickFilterButton;
    openButton.current.className = styles.quickFilterButton;
    closedButton.current.className = styles.quickFilterButton;

    if (conversationsFilter.isStateOpen === undefined) {
      allButton.current.className = styles.quickFilterButtonActive;
    } else if (conversationsFilter.isStateOpen === true) {
      openButton.current.className = styles.quickFilterButtonActive;
    } else if (conversationsFilter.isStateOpen === false) {
      closedButton.current.className = styles.quickFilterButtonActive;
    }
  };

  const setStateOpen = (setOpen: boolean) => {
    const newFilter: ConversationFilter = {...conversationsFilter};
    newFilter.isStateOpen = setOpen;
    setFilter(newFilter);
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
            <button ref={allButton} className={styles.quickFilterButton} onClick={() => setStateOpen(undefined)}>
              All
            </button>
            <button ref={openButton} className={styles.quickFilterButton} onClick={() => setStateOpen(true)}>
              Open
            </button>
            <button ref={closedButton} className={styles.quickFilterButton} onClick={() => setStateOpen(false)}>
              Closed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(ConversationsFilter);
