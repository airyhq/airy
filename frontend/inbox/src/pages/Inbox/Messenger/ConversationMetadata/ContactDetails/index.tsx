import React, {useState, useEffect, SetStateAction} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {getContactDetails, updateContactDetails} from '../../../../../actions';
import {StateModel} from '../../../../../reducers';
import {getInfoDetailsPayload, fillContactInfo} from './util';
import {UpdateContactDetailsRequestPayload} from 'httpclient/src';
import {Contact} from 'model';
import {ContactInfoPoint} from './ContactInfoPoint';
import {Expandable} from './Expandable';
import {Button} from 'components';
import {ConversationsForContact} from './ConversationsForContact';
import styles from './index.module.scss';
import {cyContactSaveButton} from 'handles';
import {useTranslation} from 'react-i18next';

export interface ConversationInfoForContact {
  id: string;
  connector: string;
}

const mapDispatchToProps = {
  getContactDetails,
  updateContactDetails,
};

const mapStateToProps = (state: StateModel) => {
  return {
    contacts: state.data.contacts.all.items,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContactDetailsProps = {
  contact?: Contact;
  conversationId?: string;
  isEditing: boolean;
  getUpdatedInfo: () => void;
  editingCanceled: boolean;
  getIsExpanded: (isExpanded: boolean) => void;
  setContactIdConvMetadata?: React.Dispatch<SetStateAction<string>>;
} & ConnectedProps<typeof connector>;

const ContactDetails = (props: ContactDetailsProps) => {
  const {
    contact,
    conversationId,
    getContactDetails,
    updateContactDetails,
    getUpdatedInfo,
    contacts,
    isEditing,
    editingCanceled,
    getIsExpanded,
    setContactIdConvMetadata,
  } = props;

  const {t} = useTranslation();
  const [contactId, setContactId] = useState('');
  const existingContact = contacts[contactId]?.via?.phone || contacts[contactId]?.title;
  const [email, setEmail] = useState(contacts[contact?.id]?.via?.email || `${t('email')}`);
  const [phone, setPhone] = useState(contacts[contact?.id]?.via?.phone || `${t('phone')}`);
  const [title, setTitle] = useState(contacts[contact?.id]?.title || `${t('title')}`);
  const [address, setAddress] = useState(contacts[contact?.id]?.address?.addressLine1 || `${t('address')}`);
  const [city, setCity] = useState(contacts[contact?.id]?.address?.city || `${t('city')}`);
  const [organization, setOrganization] = useState(contacts[contact?.id]?.organizationName || `${t('companyName')}`);
  const [newContactCollapsed, setNewContactCollapsed] = useState<boolean | string>(existingContact);
  const [existingContactCollapsed, setExistingContactCollapsed] = useState<boolean | string>(existingContact);
  const [areAvailableConversationForContact, setAreAvailableConversationForContact] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const totalInfoPoints = 6;
  const visibleInfoPointsNewContact = 1;
  const visibleInfoPointsExistingContact = 3;
  const remainingInfoPoints = newContactCollapsed
    ? totalInfoPoints - visibleInfoPointsNewContact
    : totalInfoPoints - visibleInfoPointsExistingContact;

    useEffect(() => {
      console.log('contacts', contacts);
    }, [contacts])

  useEffect(() => {
    fetchContactDetailsAndStoreId();
    setExpanded(false);
    setAreAvailableConversationForContact(false);
    setContactId('');
  }, [conversationId, contact?.id]);

  useEffect(() => {
    if (contacts && contacts[contact?.id || contactId]) {
      fillContactInfo(
        contacts[contact?.id || contactId],
        setEmail,
        setPhone,
        setTitle,
        setAddress,
        setCity,
        setOrganization
      );
      updateContactType(contacts[contact?.id || contactId]);
    }
  }, [conversationId, contactId]);

  useEffect(() => {
    if (isEditing) removeDefaultTextWhenEditing();
  }, [isEditing]);

  useEffect(() => {
    if (editingCanceled) {
      fillContactInfo(
        contacts[contact?.id || contactId],
        setEmail,
        setPhone,
        setTitle,
        setAddress,
        setCity,
        setOrganization
      );
      setExpanded(false);
    }
  }, [editingCanceled]);

  useEffect(() => {
    const currentContact = contacts[contactId] || contact;
    if (contactId && currentContact && currentContact?.conversations) {
      if (setContactIdConvMetadata) setContactIdConvMetadata(contactId);
      const conversationsForContactArr = Object.entries(currentContact?.conversations);
      if (conversationId && conversationsForContactArr.length > 2) {
        setAreAvailableConversationForContact(true);
      }
      if (!conversationId && conversationsForContactArr.length >= 1) {
        setAreAvailableConversationForContact(true);
      }
    }
  }, [contacts, contactId]);

  const fetchContactDetailsAndStoreId = async () => {
    if (conversationId && !contact?.id) {
      const contactId = await getContactDetails({conversationId: conversationId});
      setContactId(contactId);
    } else {
      await getContactDetails({id: contact.id});
      setContactId(contact.id);
    }
  };

  const removeDefaultTextWhenEditing = () => {
    if (email === t('email')) setEmail('');
    if (phone === t('phone')) setPhone('');
    if (title === t('title')) setTitle('');
    if (address === t('address')) setAddress('');
    if (city === t('city')) setCity('');
    if (organization === t('companyName')) setOrganization('');
  };

  const isExistingContact = (contact: Contact | UpdateContactDetailsRequestPayload) => {
    const phone = contact?.via?.phone;
    const title = contact?.title;
    return phone || title;
  };

  const updateContactType = (contact: Contact | UpdateContactDetailsRequestPayload) => {
    if (isExistingContact(contact)) {
      setExistingContactCollapsed(true);
      setNewContactCollapsed(false);
    } else {
      setNewContactCollapsed(true);
      setExistingContactCollapsed(false);
    }
  };

  const toggleExpandableContent = () => {
    if (isExistingContact(contacts[contact?.id || contactId])) {
      setExistingContactCollapsed(!existingContactCollapsed);
    } else {
      setNewContactCollapsed(!newContactCollapsed);
    }
    setExpanded(!expanded);
    getIsExpanded(!expanded);
  };

  const saveUpdatedInfo = () => {
    const infoDetailsPayload = getInfoDetailsPayload(
      contacts[contact?.id || contactId].id,
      email,
      phone,
      title,
      address,
      city,
      organization
    );

    updateContactDetails({...infoDetailsPayload});
    updateContactType(infoDetailsPayload);
    getUpdatedInfo();
    fillContactInfo({...infoDetailsPayload}, setEmail, setPhone, setTitle, setAddress, setCity, setOrganization);
    setExpanded(false);
    getIsExpanded(false);
  };

  return (
    <>
      <form autoComplete="off" className={styles.container}>
        <fieldset>
          <legend>Contact</legend>
          <ContactInfoPoint email={email} isEditing={isEditing} setEmail={setEmail} infoName={t('email')} />

          {(!newContactCollapsed || isEditing) && (
            <>
              <ContactInfoPoint isEditing={isEditing} phone={phone} setPhone={setPhone} infoName={t('phone')} />
              <ContactInfoPoint isEditing={isEditing} title={title} setTitle={setTitle} infoName={t('title')} />

              {(expanded || isEditing) && (
                <>
                  <ContactInfoPoint
                    isEditing={isEditing}
                    address={address}
                    setAddress={setAddress}
                    infoName={t('address')}
                  />
                  <ContactInfoPoint isEditing={isEditing} city={city} setCity={setCity} infoName={t('city')} />
                  <ContactInfoPoint
                    isEditing={isEditing}
                    organization={organization}
                    setOrganization={setOrganization}
                    infoName={t('organization')}
                  />
                </>
              )}
            </>
          )}
        </fieldset>

        {isEditing ? (
          <div className={styles.saveButtonContainer}>
            <Button dataCy={cyContactSaveButton} type="submit" styleVariant="outline-big" onClick={saveUpdatedInfo}>
              {t('save')}
            </Button>
          </div>
        ) : (
          <Expandable
            toggleExpandableContent={toggleExpandableContent}
            infoPointsNum={remainingInfoPoints}
            collapse={!!expanded}
          />
        )}
      </form>

      {contacts && contactId && contacts[contactId] && areAvailableConversationForContact && (
        <ConversationsForContact
          conversationId={conversationId}
          conversationsForContact={contacts[contactId].conversations}
        />
      )}
    </>
  );
};

export default connector(ContactDetails);
