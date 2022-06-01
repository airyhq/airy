import {Avatar, SettingsModal} from 'components';
import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as PencilIcon} from 'assets/images/icons/pencil.svg';
import {ReactComponent as TrashIcon} from 'assets/images/icons/trash.svg';
import {ReactComponent as AiryIcon} from 'assets/images/icons/airyContactIcon.svg';
import {ReactComponent as FacebookIcon} from 'assets/images/icons/facebookContactIcon.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagramContactIcon.svg';
import {ReactComponent as GoogleIcon} from 'assets/images/icons/googleContactIcon.svg';
import {ReactComponent as SmsIcon} from 'assets/images/icons/twilioSmsContactIcon.svg';
import {ReactComponent as WhatsappIcon} from 'assets/images/icons/twilioWhatsappContactIcon.svg';
import {Contact} from 'model/Contact';
import {Source} from 'model';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';
import DeleteContactModal from '../DeleteContactModal';
import {ConversationInfoForContact} from '../../Inbox/Messenger/ConversationMetadata/ContactDetails';

type ContactListItemProps = {
  contact: Contact;
  setConversationId: (conversationId: string) => void;
  setContact: (convtact: Contact) => void;
  setEditModeOn: (editOn: boolean) => void;
  setCancelEdit: (cancel: boolean) => void;
};

export const ContactListItem = (props: ContactListItemProps) => {
  const {contact, setConversationId, setContact, setEditModeOn, setCancelEdit} = props;
  const {t} = useTranslation();
  const conversationId = contact.conversations && Object.keys(contact?.conversations)[0];
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [conversationsForContact, setConversationsForContact] = useState([]);

  const formatConversationsForContact = (convObj: {[key: string]: string}) => {
    const conversationsForContactArr = [];

    for (const idProperty in convObj) {
      const convInfo = {} as ConversationInfoForContact;
      convInfo.id = idProperty;
      convInfo.connector = convObj[idProperty];
      conversationsForContactArr.push(convInfo);
    }
    return conversationsForContactArr;
  };

  useEffect(() => {
    contact?.conversations && setConversationsForContact(formatConversationsForContact(contact?.conversations));
  }, [contact?.conversations]);

  const getConversationChannels = (conversation: string) => {
    const iconArray = [];
    conversation === Source.chatPlugin && iconArray.push(<AiryIcon key={Source.chatPlugin} />);
    conversation === Source.facebook && iconArray.push(<FacebookIcon key={Source.facebook} />);
    conversation === Source.google && iconArray.push(<GoogleIcon key={Source.google} />);
    conversation === Source.instagram && iconArray.push(<InstagramIcon key={Source.instagram} />);
    conversation === Source.twilioWhatsApp && iconArray.push(<WhatsappIcon key={Source.twilioWhatsApp} />);
    conversation === Source.twilioSMS && iconArray.push(<SmsIcon key={Source.twilioSMS} />);

    return iconArray;
  };

  const handleOnClick = () => {
    contact?.conversations ? setConversationId(conversationId) : setConversationId(null);
    setContact(contact);
    setCancelEdit(true);
    setEditModeOn(false);
  };

  const handleShowModal = (show: boolean) => {
    setShowDeleteContactModal(show);
  };

  const handleEditMode = (event: any) => {
    setContact(contact);
    setEditModeOn(true);
    event.stopPropagation();
  };

  return (
    <div className={styles.container} onClick={handleOnClick}>
      <div className={styles.avatarDisplayName}>
        <Avatar contact={contact} />
        <span>{contact.displayName}</span>
      </div>
      <div className={styles.conversationChannels}>
        {contact.conversations ? (
          conversationsForContact.map((conversationInfo: ConversationInfoForContact) => (
            <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversationInfo.id}`} key={conversationInfo.id}>
              {getConversationChannels(conversationInfo.connector)}
            </Link>
          ))
        ) : (
          <span className={styles.noResults}>{t('noResultsConverstation')}</span>
        )}
      </div>
      <div className={styles.manageContainer}>
        <div onClick={event => handleEditMode(event)}>
          <PencilIcon />
        </div>
        <div onClick={() => setShowDeleteContactModal(true)}>
          <TrashIcon />
        </div>
      </div>
      {showDeleteContactModal && (
        <SettingsModal close={() => setShowDeleteContactModal(false)} title="">
          <DeleteContactModal id={contact.id} setShowModal={handleShowModal} />
        </SettingsModal>
      )}
    </div>
  );
};
