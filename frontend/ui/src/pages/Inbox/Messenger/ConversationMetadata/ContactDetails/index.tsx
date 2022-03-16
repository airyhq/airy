import React, {useState, useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {getContactsInfo, updateContactsInfo} from '../../../../../actions';
import {StateModel} from '../../../../../reducers';
import {UpdateContactInfoRequestPayload} from 'httpclient/src';
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
  editingOn:boolean;
  getUpdatedInfo:(updatedInfo: UpdateContactInfoRequestPayload) => void;
  updateInfoTrigger:boolean;
  setUpdateInfoTrigger: React.Dispatch<React.SetStateAction<boolean>>
  editingCanceled:boolean;
} & ConnectedProps<typeof connector>;

const ContactDetails = (props: ContactInfoProps) => {
  const {conversationId, getContactsInfo, getUpdatedInfo, contacts, editingOn, updateInfoTrigger, setUpdateInfoTrigger, editingCanceled} = props;

  const [email, setEmail] = useState('email');
  const [phone, setPhone] = useState('phone');
  const [title, setTitle] = useState('title');
  const [address, setAddress] = useState('address');
  const [city, setCity] = useState('city');
  const [organization, setOrganization] = useState('company name');

  useEffect(() => {
    getContactsInfo(conversationId);
  }, [conversationId]);

  useEffect(() => {
    console.log('editingCanceled', editingCanceled);
    console.log('EDITING RESET');
    //refactor this in one func
    const email = contacts[conversationId]?.via?.email;
    const phone = contacts[conversationId]?.via?.phone;
    const title = contacts[conversationId]?.title;
    const address = contacts[conversationId]?.address?.addressLine1;
    const city = contacts[conversationId]?.address?.city;
    const organizationName = contacts[conversationId]?.organizationName;
    console.log('title', title)

      email ? setEmail(email) : setEmail('email');
      phone ? setPhone(phone) : setEmail('phone');
      title ? setTitle(title) : setTitle('title');
      address ? setAddress(address) : setAddress('address');
      city ? setCity(city) : setCity('city');
      organizationName ? setOrganization(organizationName) : setOrganization('company name');
      address ? setAddress(address) : setAddress('address');
  }, [editingCanceled])

  useEffect(() => {
    if (contacts && contacts[conversationId]) {
      console.log('EDITING RESET');
      //const {organizationName, title, via:{email, phone}, address: {addressLine1, city}} = contacts[conversationId];
      const email = contacts[conversationId]?.via?.email;
      const phone = contacts[conversationId]?.via?.phone;
      const title = contacts[conversationId]?.title;
      const address = contacts[conversationId]?.address?.addressLine1;
      const city = contacts[conversationId]?.address?.city;
      const organizationName = contacts[conversationId]?.organizationName;

        email ? setEmail(email) : setEmail('email');
        phone ? setPhone(phone) : setEmail('phone');
        title ? setTitle(title) : setTitle('title');
        address ? setAddress(address) : setAddress('address');
        city ? setCity(city) : setCity('city');
        organizationName ? setOrganization(organizationName) : setOrganization('company name');
        address ? setAddress(address) : setAddress('address');
    }
    
  }, [contacts]);

  useEffect(() => {
    console.log('editingOn', editingOn)
    if(updateInfoTrigger){
      const infoDetails: any = {
        id: contacts[conversationId].id
      };
  
      if (title !== 'title') infoDetails.title = title;
      if (organization !== 'company name') infoDetails.organizationName = organization;
      if (phone !== 'phone'){
        infoDetails.via = {};
        infoDetails.via.phone = phone;
      } 
      if (email !== 'email'){
        if(!infoDetails.via) infoDetails.via = {};
        infoDetails.via.email = email;
      } 
      if (address !== 'address'){
        infoDetails.address = {};
        infoDetails.address.addressLine1 = address;
      } 
      if(city !== 'city'){
        if(!infoDetails.address) infoDetails.address = {};
        infoDetails.address.city = city;
      }

      getUpdatedInfo(infoDetails)
    }
  }, [updateInfoTrigger])

  //figure out if one contact is filled 

  return (
    <section className={styles.container}>

      <h1>Contact</h1>
      <span className={editingOn ? styles.borderBlue : ''}>
        Email:{' '}
        {!editingOn ? (
          email
        ) : (
          <input type="text"  autoFocus placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        )}
      </span>
      <span className={editingOn ? styles.borderBlue : ''}>
        Phone:
        {!editingOn ? (
          phone
        ) : (
          <input type="text" autoFocus placeholder="phone" value={phone} onChange={e => setPhone(e.target.value)} />
        )}
      </span>
      <span className={editingOn ? styles.borderBlue : ''}>
        Title:{' '}
        {!editingOn ? (
          title
        ) : (
          <input type="text"  autoFocus placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
        )}
      </span>
      <span className={editingOn ? styles.borderBlue : ''}>
        Address:{' '}
        {!editingOn ? (
          address
        ) : (
          <input type="text"  autoFocus placeholder="address" value={address} onChange={e => setAddress(e.target.value)} />
        )}
      </span>
      <span className={editingOn ? styles.borderBlue : ''}>
        City:{' '}
        {!editingOn ? (
          city
        ) : (
          <input type="text"  autoFocus placeholder="city" value={city} onChange={e => setCity(e.target.value)} />
        )}
      </span>
      <span className={editingOn ? styles.borderBlue : ''}>
        Organization:{' '}
        {!editingOn ? (
          organization
        ) : (
          <input
            type="text"
            autoFocus
            placeholder="company name"
            value={organization}
            onChange={e => setOrganization(e.target.value)}
          />
        )}
      </span>

          {editingOn && (
            <div className={styles.saveButtonContainer}>
              <Button type="submit" styleVariant="outline" onClick={() => setUpdateInfoTrigger(true)}>SAVE</Button>
            </div>
          )}

    </section>
  );
};

export default connector(ContactDetails);
