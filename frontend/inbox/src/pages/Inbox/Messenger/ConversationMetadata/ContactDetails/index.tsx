import React, {useState, useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {getContactDetails, updateContactDetails} from '../../../../../actions';
import {StateModel} from '../../../../../reducers';
import {getInfoDetailsPayload, fillContactInfo} from './util';
import {UpdateContactDetailsRequestPayload} from 'httpclient/src';
import {Contact, Source} from 'model';
import {ContactInfoPoint} from './ContactInfoPoint';
import {Expandable} from './Expandable';
import {Button, ConnectorAvatar} from 'components';
import {Link} from 'react-router-dom';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../../../routes/routes';
import styles from './index.module.scss';
import {cyContactSaveButton} from 'handles';

const mapDispatchToProps = {
  getContactDetails,
  updateContactDetails,
};

const mapStateToProps = (state: StateModel) => {
  return {
    contacts: state.data.contacts.all,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContactDetailsProps = {
  conversationId: string;
  isEditing: boolean;
  getUpdatedInfo: () => void;
  editingCanceled: boolean;
  getIsExpanded: (isExpanded: boolean) => void;
} & ConnectedProps<typeof connector>;

const ContactDetails = (props: ContactDetailsProps) => {
  const {
    conversationId,
    getContactDetails,
    updateContactDetails,
    getUpdatedInfo,
    contacts,
    isEditing,
    editingCanceled,
    getIsExpanded,
  } = props;

  const existingContact = contacts[conversationId]?.via?.phone || contacts[conversationId]?.title;
  const [email, setEmail] = useState('email');
  const [phone, setPhone] = useState('phone');
  const [title, setTitle] = useState('title');
  const [address, setAddress] = useState('address');
  const [city, setCity] = useState('city');
  const [organization, setOrganization] = useState('company name');
  const [newContactCollapsed, setNewContactCollapsed] = useState<boolean | string>(existingContact);
  const [existingContactCollapsed, setExistingContactCollapsed] = useState<boolean | string>(existingContact);
  const [conversationsForContact, setConversationsForContact] = useState([]);
  const [areOthersConversationForContact, setAreOthersConversationForContact] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const totalInfoPoints = 6;
  const visibleInfoPointsNewContact = 1;
  const visibleInfoPointsExistingContact = 3;
  const remainingInfoPoints = newContactCollapsed
    ? totalInfoPoints - visibleInfoPointsNewContact
    : totalInfoPoints - visibleInfoPointsExistingContact;

  useEffect(() => {
    getContactDetails(conversationId);
    setExpanded(false);
  }, [conversationId]);

  useEffect(() => {
    if (conversationId && contacts && contacts[conversationId]) {
      fillContactInfo(contacts[conversationId], setEmail, setPhone, setTitle, setAddress, setCity, setOrganization);
      updateContactType(contacts[conversationId]);
      setConversationsForContact(formatConversationsForContact(contacts[conversationId].conversations));
    }
  }, [contacts, conversationId]);

  useEffect(() => {
    console.log('contactConversations', conversationsForContact);
  }, [conversationsForContact]);

  useEffect(() => {
    if (isEditing) removeDefaultTextWhenEditing();
  }, [isEditing]);

  useEffect(() => {
    if (editingCanceled) {
      fillContactInfo(contacts[conversationId], setEmail, setPhone, setTitle, setAddress, setCity, setOrganization);
      setExpanded(false);
    }
  }, [editingCanceled]);

  const formatConversationsForContact = (convObj: any) => {
    const conversationsForContactArr = [];
    for (const property in convObj) {
      if (property !== conversationId) setAreOthersConversationForContact(false);
      const obj: any = {};
      obj.id = property;
      obj.connector = convObj[property];
      conversationsForContactArr.push(obj);
    }
    return conversationsForContactArr;
  };

  const removeDefaultTextWhenEditing = () => {
    if (email === 'email') setEmail('');
    if (phone === 'phone') setPhone('');
    if (title === 'title') setTitle('');
    if (address === 'address') setAddress('');
    if (city === 'city') setCity('');
    if (organization === 'company name') setOrganization('');
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
    if (isExistingContact(contacts[conversationId])) {
      setExistingContactCollapsed(!existingContactCollapsed);
    } else {
      setNewContactCollapsed(!newContactCollapsed);
    }
    setExpanded(!expanded);
    getIsExpanded(!expanded);
  };

  const saveUpdatedInfo = () => {
    const infoDetailsPayload = getInfoDetailsPayload(
      contacts[conversationId].id,
      email,
      phone,
      title,
      address,
      city,
      organization
    );
    updateContactDetails(conversationId, {...infoDetailsPayload});
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
          <ContactInfoPoint email={email} isEditing={isEditing} setEmail={setEmail} infoName="email" />

          {(!newContactCollapsed || isEditing) && (
            <>
              <ContactInfoPoint isEditing={isEditing} phone={phone} setPhone={setPhone} infoName="phone" />
              <ContactInfoPoint isEditing={isEditing} title={title} setTitle={setTitle} infoName="title" />

              {(expanded || isEditing) && (
                <>
                  <ContactInfoPoint
                    isEditing={isEditing}
                    address={address}
                    setAddress={setAddress}
                    infoName="address"
                  />
                  <ContactInfoPoint isEditing={isEditing} city={city} setCity={setCity} infoName="city" />
                  <ContactInfoPoint
                    isEditing={isEditing}
                    organization={organization}
                    setOrganization={setOrganization}
                    infoName="organization"
                  />
                </>
              )}
            </>
          )}
        </fieldset>

        {isEditing ? (
          <div className={styles.saveButtonContainer}>
            <Button dataCy={cyContactSaveButton} type="submit" styleVariant="outline-big" onClick={saveUpdatedInfo}>
              Save
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

      {areOthersConversationForContact && (
        <div className={styles.contactConversationList}>
          <span>Other available conversations for this contact:</span>
          {conversationsForContact.map((conversationInfo: {[key: string]: string}) => {
            if (conversationInfo.id) {
              <button>
                <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversationInfo.id}`}>
                  <ConnectorAvatar source={conversationInfo.source as Source} />
                </Link>
              </button>;
            }
          })}
        </div>
      )}
    </>
  );
};

//conversationInfo.id !== conversationId

export default connector(ContactDetails);
