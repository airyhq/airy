import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {ConversationFilter, StateModel} from '../../../reducers';

import {setFilter} from '../../../actions/conversationsFilter';

import styles from './index.module.scss';
import {omit} from 'lodash-es';
import {useTranslation} from 'react-i18next';

const mapStateToProps = (state: StateModel) => {
  return {
    currentFilter: state.data.conversations.filtered.currentFilter,
  };
};

const mapDispatchToProps = {
  setFilter,
};

type filterStates = 'all' | 'open' | 'closed';

const connector = connect(mapStateToProps, mapDispatchToProps);

type ConversationsFilterProps = {} & ConnectedProps<typeof connector>;

const QuickFilter = (props: ConversationsFilterProps) => {
  const {setFilter, currentFilter} = props;
  const {t} = useTranslation();
  const [filterState, setFilterState] = useState('all');

  useEffect(() => {
    const {isStateOpen} = currentFilter;
    if (isStateOpen === undefined) {
      setFilterState('all');
    } else {
      setFilterState(isStateOpen ? 'open' : 'closed');
    }
  }, [currentFilter]);

  const setCurrentState = (newState: filterStates) => {
    let newFilter: ConversationFilter = {...omit(currentFilter, 'isStateOpen')};
    if (newState !== 'all') {
      newFilter = {
        ...newFilter,
        isStateOpen: newState === 'open',
      };
    }

    setFilter(newFilter);
    setFilterState(newState);
  };

  return (
    <div>
      <div className={styles.quickFilterContainer}>
        <div className={styles.quickFilterButtons}>
          <div className={styles.quickFilterButtonsBackground}>
            <button
              className={filterState === 'all' ? styles.quickFilterButtonActive : styles.quickFilterButton}
              onClick={() => setCurrentState('all')}
            >
              {t('all')}
            </button>
            <button
              className={filterState === 'open' ? styles.quickFilterButtonActive : styles.quickFilterButton}
              onClick={() => setCurrentState('open')}
            >
              {t('open')}
            </button>
            <button
              className={filterState === 'closed' ? styles.quickFilterButtonActive : styles.quickFilterButton}
              onClick={() => setCurrentState('closed')}
            >
              {t('closed')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(QuickFilter);
