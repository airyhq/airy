import React from 'react';
import styles from './NoConversations.module.scss';
import {connect, ConnectedProps} from 'react-redux';

const mapStateToProps = state => {
  return {
    currentFilter: state.data.conversations.filtered.currentFilter,
  };
};

const connector = connect(mapStateToProps);

const NoConversations = ({currentFilter}: ConnectedProps<typeof connector>) => {
  return Object.keys(currentFilter || {}).length === 0 ? (
    <div className={styles.component}>
      <strong>{'messenger.emptyState.headline'}</strong>
      <p>{'messenger.emptyState.description'}</p>
    </div>
  ) : (
    <div className={styles.component}>
      <strong>{'messenger.noResult.headline'}</strong>
      <p>{'messenger.noResult.description'}</p>
    </div>
  );
};

export default connector(NoConversations);
