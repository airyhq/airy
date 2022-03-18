import React, {useState, useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {getContactsInfo, updateContactsInfo} from '../../../../../actions';
import {StateModel} from '../../../../../reducers';
import {getInfoDetailsPayload, fillContactInfo} from './util';
import {UpdateContactInfoRequestPayload} from 'httpclient/src';
import {ContactInfo} from 'model';
import {ContactInfoPoint} from './ContactInfoPoint';
import {Expandable} from './Expandable';
import {Button} from 'components';
import styles from './index.module.scss';

const mapDispatchToProps = {
  getContactsInfo,
  updateContactsInfo,
};

const mapStateToProps = (state: StateModel) => {
  return {
    contacts: state.data.contacts.all,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContactInfoProps = {
  conversationId: string;
  editingOn: boolean;
  getUpdatedInfo: () => void;
  editingCanceled: boolean;
  getIsExpanded: (isExpanded: boolean) => void;
} & ConnectedProps<typeof connector>;

const ContactDetails = (props: ContactInfoProps) => {
  const {
    conversationId,
    getContactsInfo,
    getUpdatedInfo,
    contacts,
    editingOn,
    updateContactsInfo,
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
  const [expanded, setExpanded] = useState(false);
  const totalInfoPoints = 6;
  const visibleInfoPointsnewContact = 1;
  const visibleInfoPointsExistingContact = 3;
  const remainingInfoPoints = newContactCollapsed
    ? totalInfoPoints - visibleInfoPointsnewContact
    : totalInfoPoints - visibleInfoPointsExistingContact;

  useEffect(() => {
    getContactsInfo(conversationId);
    setExpanded(false);
  }, [conversationId]);

  useEffect(() => {
    if (conversationId && contacts && contacts[conversationId]) {
      fillContactInfo(contacts[conversationId], setEmail, setPhone, setTitle, setAddress, setCity, setOrganization);
      updateContactType(contacts[conversationId]);
    }
  }, [contacts, conversationId]);

  useEffect(() => {
    if (editingOn) removeDefaultTextWhenEditing();
  }, [editingOn]);

  useEffect(() => {
    if (editingCanceled) {
      fillContactInfo(contacts[conversationId], setEmail, setPhone, setTitle, setAddress, setCity, setOrganization);
      setExpanded(false);
    }
  }, [editingCanceled]);

  const removeDefaultTextWhenEditing = () => {
    if (email === 'email') setEmail('');
    if (phone === 'phone') setPhone('');
    if (title === 'title') setTitle('');
    if (address === 'address') setAddress('');
    if (city === 'city') setCity('');
    if (organization === 'company name') setOrganization('');
  };

  const isExistingContact = (contactInfo: UpdateContactInfoRequestPayload | ContactInfo) => {
    const phone = contactInfo?.via?.phone;
    const title = contactInfo?.title;
    return phone || title;
  };

  const updateContactType = (contactInfo: UpdateContactInfoRequestPayload | ContactInfo) => {
    if (isExistingContact(contactInfo)) {
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
    updateContactsInfo(conversationId, {...infoDetailsPayload});
    updateContactType(infoDetailsPayload);
    getUpdatedInfo();
    fillContactInfo({...infoDetailsPayload}, setEmail, setPhone, setTitle, setAddress, setCity, setOrganization);
    setExpanded(false);
    getIsExpanded(false);
  };

  return (
    <section className={styles.container}>
      <h1>Contact</h1>
      <ContactInfoPoint email={email} editingOn={editingOn} setEmail={setEmail} infoName="email" />

      {(!newContactCollapsed || editingOn) && (
        <>
          <ContactInfoPoint editingOn={editingOn} phone={phone} setPhone={setPhone} infoName="phone" />
          <ContactInfoPoint editingOn={editingOn} title={title} setTitle={setTitle} infoName="title" />

          {(expanded || editingOn) && (
            <>
              <ContactInfoPoint editingOn={editingOn} address={address} setAddress={setAddress} infoName="address" />
              <ContactInfoPoint editingOn={editingOn} city={city} setCity={setCity} infoName="city" />
              <ContactInfoPoint
                editingOn={editingOn}
                organization={organization}
                setOrganization={setOrganization}
                infoName="organization"
              />
            </>
          )}
        </>
      )}

      {editingOn ? (
        <div className={styles.saveButtonContainer}>
          <Button type="submit" styleVariant="outline-big" onClick={saveUpdatedInfo}>
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
    </section>
  );
};

export default connector(ContactDetails);
