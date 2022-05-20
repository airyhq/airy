import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import {conversationState, setFilter} from '../../../../actions';
import {StateModel} from '../../../../reducers';
import {cyConversationStatus} from 'handles';
import {SimpleLoader} from 'components';
import {useCurrentConversation} from '../../../../selectors/conversations';
import {useTranslation} from 'react-i18next';

const mapStateToProps = (state: StateModel) => ({
  currentFilter: state.data.conversations.filtered.currentFilter,
});

const mapDispatchToProps = {
  conversationState,
  setFilter,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

function ConversationStatus(props: ConnectedProps<typeof connector>) {
  const {conversationState, currentFilter, setFilter} = props;
  const {t} = useTranslation();

  const conversation = useCurrentConversation();
  const currentConversationState = conversation?.metadata?.state || 'OPEN';
  const [buttonStateEnabled, setButtonStateEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleState = (id: string, state: string) => {
    if (buttonStateEnabled && currentConversationState !== state) {
      setLoading(true);
      setButtonStateEnabled(false);
      conversationState(id, state);

      setTimeout(() => {
        if (Object.entries(currentFilter).length !== 0) {
          setFilter(currentFilter);
        }
        setButtonStateEnabled(true);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div
      className={`${styles.conversationStatus} ${currentConversationState === 'CLOSED' ? styles.closed : styles.open}`}
      data-cy={cyConversationStatus}
    >
      {loading ? (
        <SimpleLoader />
      ) : (
        <>
          <div className={styles.closedButtonWrapper}>
            <div className={styles.closedButton} onClick={() => toggleState(conversation?.id, 'CLOSED')}>
              {t('closed')}
            </div>
          </div>
          <div className={styles.openButtonWrapper}>
            <div className={styles.openButton} onClick={() => toggleState(conversation?.id, 'OPEN')}>
              {t('open')}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default connector(ConversationStatus);
