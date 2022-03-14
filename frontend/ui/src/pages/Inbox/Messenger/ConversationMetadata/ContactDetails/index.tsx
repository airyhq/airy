import React, {useState, useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {getContactsInfo} from '../../../../../actions';
import {StateModel} from '../../../../../reducers';
import {ContactInfo} from 'model';
import styles from './index.module.scss';


const mapDispatchToProps = {
  getContactsInfo,
};


const mapStateToProps = (state: StateModel) => {
  return {
    contacts: state.data.contacts.all,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContactInfoProps = {
  conversationId: string;
} &ConnectedProps<typeof connector>;

const ContactDetails = (props: ContactInfoProps) => {
  const {conversationId, getContactsInfo, contacts} = props;
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [organization, setOrganization] = useState('');

  useEffect(() => {
    getContactsInfo(conversationId);
  }, []);

  useEffect(() => {
    if(contacts && contacts[conversationId]){
      console.log('contacts[conversationId]', contacts[conversationId]);
      //const {organizationName, title, via:{email, phone}, address: {addressLine1, city}} = contacts[conversationId];
      const email = contacts[conversationId]?.via?.email;
      const phone = contacts[conversationId]?.via?.phone;
      const title = contacts[conversationId]?.title;
      const address = contacts[conversationId]?.address?.addressLine1 + contacts[conversationId]?.address?.city;
      const organizationName = contacts[conversationId]?.organizationName

      console.log('INFO', contacts[conversationId]?.title)

      if(email) setEmail(email);
      if(phone) setPhone(phone);
      if(title) setTitle(title);
      if(address) setAddress(address);
      if(organizationName) setOrganization(organizationName);
    }
  }, [contacts])

  return (
    <section className={styles.container}>
      <h1>Contact</h1>
      <span>Email:{email}</span>
      <span>Phone: {phone}</span>
      <span>Title: {title}</span>
      <span>Address: {address}</span>
      <span>Organization: {organization}</span>
    </section>
  );
};

export default connector(ContactDetails);
