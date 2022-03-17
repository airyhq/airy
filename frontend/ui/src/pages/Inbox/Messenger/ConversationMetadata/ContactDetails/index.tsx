import React, {useState, useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {getContactsInfo, updateContactsInfo} from '../../../../../actions';
import {StateModel} from '../../../../../reducers';
import { getInfoDetailsPayload, fillContactInfo } from './util';
import {UpdateContactInfoRequestPayload} from 'httpclient/src';
import {ContactInfoPoint} from './ContactInfoPoint';
import {ReactComponent as ArrowRight} from 'assets/images/icons/arrowRight.svg';
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
  getUpdatedInfo: (updatedInfo: UpdateContactInfoRequestPayload) => void;
  updateInfoTrigger: boolean;
  setUpdateInfoTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  editingCanceled: boolean;
} & ConnectedProps<typeof connector>;

const ContactDetails = (props: ContactInfoProps) => {
  const {
    conversationId,
    getContactsInfo,
    getUpdatedInfo,
    contacts,
    editingOn,
    updateInfoTrigger,
    setUpdateInfoTrigger,
    editingCanceled,
  } = props;

  const [email, setEmail] = useState('email');
  const [phone, setPhone] = useState('phone');
  const [title, setTitle] = useState('title');
  const [address, setAddress] = useState('address');
  const [city, setCity] = useState('city');
  const [organization, setOrganization] = useState('company name');
  const [newContactCollapsed, setNewContactCollapsed] = useState(false);
  const [existingContactCollapsed, setExistingContactCollapsed] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const totalInfoPoints = 6;

  useEffect(() => {
    getContactsInfo(conversationId);
    setExpanded(false);
  }, [conversationId]);

  useEffect(() => {
    if (conversationId && contacts && contacts[conversationId]) {
      console.log('FILL CONTACT INFO // NEW OR EXISTING');
      fillContactInfo(contacts[conversationId], setEmail, setPhone, setTitle, setAddress, setCity, setOrganization);
      setUpExpandableForContact();
    }
  }, [contacts, conversationId]);

  useEffect(() => {
    if (editingOn) removeDefaultTextWhenEditing();
  }, [editingOn]);

  useEffect(() => {
    if (editingCanceled) {
      console.log('EDITING CANCELED: FILL CONTACT INFO // NEW OR EXISTING');
      fillContactInfo(contacts[conversationId], setEmail, setPhone, setTitle, setAddress, setCity, setOrganization);
      setExpanded(false);
    }
  }, [editingCanceled]);

  useEffect(() => {
    if (updateInfoTrigger) {
      const infoDetailsPayload = getInfoDetailsPayload(contacts[conversationId].id, email, phone, title, address, city, organization);
      getUpdatedInfo(infoDetailsPayload);
    }
  }, [updateInfoTrigger]);

  const removeDefaultTextWhenEditing = () => {
    if (email === 'email') setEmail('');
    if (phone === 'phone') setPhone('');
    if (title === 'title') setTitle('');
    if (address === 'address') setAddress('');
    if (city === 'city') setCity('');
    if (organization === 'company name') setOrganization('');
  }

  const isExistingContact = () => {
    const phone = contacts[conversationId]?.via?.phone;
    const title = contacts[conversationId]?.title;
    console.log('isExistingContact', phone || title);
    return (phone || title);
  }

  const setUpExpandableForContact = () => {
    if (isExistingContact()) {
      setExistingContactCollapsed(true);
      setNewContactCollapsed(false);
    } else {
      setNewContactCollapsed(true);
      setExistingContactCollapsed(false);
    }
  };

  const toggleExpandableContent = () => {
    const phone = contacts[conversationId]?.via?.phone;
    const title = contacts[conversationId]?.title;
    const isExistingContact = phone || title;
    setExpanded(!expanded);

    if (isExistingContact) {
      setExistingContactCollapsed(!existingContactCollapsed);
    } else {
      setNewContactCollapsed(!newContactCollapsed);
    }
  };

  const saveUpdatedInfo = () => {
    setUpdateInfoTrigger(true);
    setExpanded(false);
    setUpExpandableForContact();
  };

  return (
    <section className={styles.container}>
      <h1>Contact</h1>
      <ContactInfoPoint editingOn={editingOn} setEmail={setEmail} infoName="email" />
      {newContactCollapsed && !expanded && !editingOn && (
        <div className={styles.expandable} onClick={toggleExpandableContent}>
          <ArrowRight className={styles.arrowIcon} /> <span> See all ({totalInfoPoints - 1})</span>
        </div>
      )}
      {(!newContactCollapsed || editingOn) && (
        <>
          <span className={editingOn ? styles.borderBlue : ''}>
            <span className={styles.detailName}>Phone:</span>
            {!editingOn ? (
              phone
            ) : (
              <label htmlFor="phone">
                <input
                  type="tel"
                  inputMode="tel"
                  name="phone"
                  autoComplete="new-off"
                  placeholder="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </label>
            )}
          </span>
          <span className={editingOn ? styles.borderBlue : ''}>
            <span className={styles.detailName}>Title:</span>
            {!editingOn ? (
              title
            ) : (
              <label htmlFor="title">
                <input
                  type="text"
                  name="title"
                  autoComplete="new-off"
                  placeholder="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </label>
            )}
          </span>
          {!newContactCollapsed && existingContactCollapsed && !expanded && !editingOn && (
            <div className={styles.expandable} onClick={toggleExpandableContent}>
              <ArrowRight className={styles.arrowIcon} />
              <span> See all ({totalInfoPoints - 3})</span>
            </div>
          )}
          {(expanded || editingOn) && (
            <>
              <span className={editingOn ? styles.borderBlue : ''}>
                <span className={styles.detailName}>Address:</span>
                {!editingOn ? (
                  address
                ) : (
                  <label htmlFor="address">
                    <input
                      type="text"
                      name="address"
                      autoComplete="new-off"
                      placeholder="address"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                  </label>
                )}
              </span>
              <span className={editingOn ? styles.borderBlue : ''}>
                <span className={styles.detailName}>City:</span>
                {!editingOn ? (
                  city
                ) : (
                  <label htmlFor="city">
                    <input
                      type="text"
                      name="city"
                      autoComplete="new-off"
                      placeholder="city"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                  </label>
                )}
              </span>
              <span className={editingOn ? styles.borderBlue : ''}>
                <span className={styles.detailName}>Organization:</span>
                {!editingOn ? (
                  organization
                ) : (
                  <label htmlFor="organization">
                    <input
                      type="text"
                      name="organization"
                      autoComplete="new-off"
                      placeholder="company name"
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                    />
                  </label>
                )}
              </span>
              {!editingOn && expanded && !editingOn && (
                <div className={styles.expandable} onClick={toggleExpandableContent}>
                  <ArrowRight className={styles.arrowIcon} />
                  <span> See less</span>
                </div>
              )}
            </>
          )}
        </>
      )}

      {editingOn && (
        <div className={styles.saveButtonContainer}>
          <Button type="submit" styleVariant="outline-big" onClick={saveUpdatedInfo}>
            Save
          </Button>
        </div>
      )}
    </section>
  );
};

export default connector(ContactDetails);
