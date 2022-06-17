import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {INBOX_CONVERSATIONS_ROUTE} from '../../routes/routes';
import {Source} from 'model';
import {ConnectorAvatar} from 'components';
import {useTranslation} from 'react-i18next';
import {ConversationInfoForContact} from './index';
import {cyConversationsListForContact, cyConversationForContactButton} from 'handles';
import styles from './index.module.scss';

type ConversationsForContactsProps = {
  conversationId: string;
  conversationsForContact: {[conversationId: string]: Source};
};

export const ConversationsForContact = (props: ConversationsForContactsProps) => {
  const {conversationId, conversationsForContact} = props;
  const {t} = useTranslation();
  const [conversationsForContactFormatted, setConversationsForContactFormatted] = useState([]);

  useEffect(() => {
    formatConversationsForContact();
  }, []);

  const formatConversationsForContact = () => {
    const conversationsIdForContactArr = Object?.entries(conversationsForContact);
    const conversationsForContactArr = [];

    if (conversationsIdForContactArr.length > 0) {
      for (const idProperty in conversationsForContact) {
        const convInfo = {} as ConversationInfoForContact;

        if (idProperty !== conversationId) {
          convInfo.id = idProperty;
          convInfo.connector = conversationsForContact[idProperty];
          conversationsForContactArr.push(convInfo);
        }
      }
      setConversationsForContactFormatted(conversationsForContactArr);
    }
  };

  return (
    <div className={styles.contactConversationList} data-cy={cyConversationsListForContact}>
      <span>{conversationId ? t('otherConversationsContact') : t('conversationsContact')}</span>
      <div className={styles.iconsContainer}>
        {conversationsForContactFormatted.length > 0 &&
          conversationsForContactFormatted.map((conversationInfo: ConversationInfoForContact) => (
            <button type="button" key={conversationInfo.id} data-cy={cyConversationForContactButton}>
              <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversationInfo.id}`}>
                <ConnectorAvatar source={conversationInfo.connector as Source} />
              </Link>
            </button>
          ))}
      </div>
    </div>
  );
};
