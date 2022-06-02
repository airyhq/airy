import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {Contact} from 'model';
import {ContactIcon} from '../../Inbox/Messenger/ConversationMetadata/ContactDetails/ContactIcon';
import {useTranslation} from 'react-i18next';
import {updateContactDetails} from '../../../actions/contacts';
import {connect, ConnectedProps} from 'react-redux';
import {Button} from 'components';

const mapDispatchToProps = {
  updateContactDetails,
};

const connector = connect(null, mapDispatchToProps);

type ContactDetailsProps = {
  contact: Contact;
  conversationId: string;
  isEditing: boolean;
  cancelEditing: boolean;
} & ConnectedProps<typeof connector>;

const ContactDetails = (props: ContactDetailsProps) => {
  const {contact, conversationId, isEditing, cancelEditing, updateContactDetails} = props;
  const {t} = useTranslation();
  const [email, setEmail] = useState(contact?.via?.email || 'email');
  const [phone, setPhone] = useState(contact?.via?.phone || 'phone');
  const [title, setTitle] = useState(contact.title || 'title');
  const [address, setAddress] = useState(contact?.address?.addressLine1 || 'address');
  const [city, setCity] = useState(contact?.address?.city || 'city');
  const [organization, setOrganization] = useState(contact?.organizationName || 'company name');
  const [editModeOn, setEditModeOn] = useState(isEditing || false);

  useEffect(() => {
    setEmail(contact?.via?.email || 'email');
    setPhone(contact?.via?.phone || 'phone');
    setTitle(contact?.title || 'title');
    setAddress(contact?.address?.addressLine1 || 'address');
    setCity(contact?.address?.city || 'city');
    setOrganization(contact?.organizationName || 'company name');
    setEditModeOn(false);
  }, [contact.id]);

  useEffect(() => {
    setEditModeOn(isEditing);
  }, [isEditing]);

  useEffect(() => {
    cancelEditing &&
      (setEmail(contact?.via?.email),
      setPhone(contact?.via?.phone),
      setTitle(contact?.title),
      setAddress(contact?.address?.addressLine1),
      setCity(contact?.address?.city),
      setOrganization(contact?.organizationName));
  }, [cancelEditing]);

  const handleUpdateContact = () => {
    updateContactDetails(conversationId, {id: contact.id, via: {email, phone}, title, organizationName: organization});
  };

  return (
    <div className={styles.container}>
      <form autoComplete="off" className={styles.container}>
        <fieldset>
          <legend>Contact</legend>
          <div className={editModeOn ? `${styles.editModeOn}` : `${styles.editModeOff}`}>
            {ContactIcon('email')}
            <span>{t('email')}:</span>
            <input
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder={t('email')}
              disabled={!editModeOn}
              autoFocus={editModeOn ? true : false}
            />
          </div>
          <div className={editModeOn ? `${styles.editModeOn}` : `${styles.editModeOff}`}>
            {ContactIcon(t('phone'))}
            <span>{t('phone')}:</span>
            <input
              value={phone}
              onChange={event => setPhone(event.target.value)}
              placeholder={t('phone')}
              disabled={!editModeOn}
            />
          </div>
          <div className={editModeOn ? `${styles.editModeOn}` : `${styles.editModeOff}`}>
            {ContactIcon(t('title'))}
            <span>{t('title')}:</span>
            <input
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder={t('title')}
              disabled={!editModeOn}
            />
          </div>
          <div className={editModeOn ? `${styles.editModeOn}` : `${styles.editModeOff}`}>
            {ContactIcon(t('address'))}
            <span>{t('address')}:</span>
            <input
              value={address}
              onChange={event => setAddress(event.target.value)}
              placeholder={t('address')}
              disabled={!editModeOn}
            />
          </div>
          <div className={editModeOn ? `${styles.editModeOn}` : `${styles.editModeOff}`}>
            {ContactIcon(t('city'))}
            <span>{t('city')}:</span>
            <input
              value={city}
              onChange={event => setCity(event.target.value)}
              placeholder={t('city')}
              disabled={!editModeOn}
            />
          </div>
          <div className={editModeOn ? `${styles.editModeOn}` : `${styles.editModeOff}`}>
            {ContactIcon(t('organization'))}
            <span>{t('organization')}:</span>
            <input
              value={organization}
              onChange={event => setOrganization(event.target.value)}
              placeholder={t('organization')}
              disabled={!editModeOn}
            />
          </div>
        </fieldset>
      </form>

      {editModeOn && (
        <Button onClick={handleUpdateContact} styleVariant="outline">
          {t('save')}
        </Button>
      )}
    </div>
  );
};

export default connector(ContactDetails);
