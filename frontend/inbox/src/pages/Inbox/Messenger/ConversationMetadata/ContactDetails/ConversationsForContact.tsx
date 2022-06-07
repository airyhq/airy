import React from 'react';
import {Link} from 'react-router-dom';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../../../routes/routes';
import {Source} from 'model';
import {ConnectorAvatar} from 'components';
import styles from './index.module.scss';

type ConversationsForContacts = {
    conversationId: string;
    
}


const ConversationsForContacts = (: string) => {

    return(
        <div className={styles.contactConversationList}>
        <span>{conversationId ? t('otherConversationsContact') : t('conversationsContact')}</span>
        <div className={styles.iconsContainer}>
          {conversationsForContact.map((conversationInfo: ConversationInfoForContact) => (
            <button type="button" key={conversationInfo.id}>
              <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversationInfo.id}`}>
                <ConnectorAvatar source={conversationInfo.connector as Source} />
              </Link>
            </button>
          ))}
        </div>
      </div>
    )
}