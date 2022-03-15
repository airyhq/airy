import React, {useState, useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {getContactsInfo, updateContactsInfo} from '../../../../../actions';
import {StateModel} from '../../../../../reducers';
import {ContactInfo} from 'model';
import {ReactComponent as EditPencilIcon} from 'assets/images/icons/edit.svg';
import {ReactComponent as CancelIcon} from 'assets/images/icons/cancelCross.svg';
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
} & ConnectedProps<typeof connector>;

const ContactDetails = (props: ContactInfoProps) => {
  const {conversationId, getContactsInfo, updateContactsInfo, contacts} = props;

  const [email, setEmail] = useState('email');
  const [phone, setPhone] = useState('phone');
  const [title, setTitle] = useState('title');
  const [address, setAddress] = useState('address');
  const [organization, setOrganization] = useState('company name');
  const [editingOn, setEditingOn] = useState(false);

  useEffect(() => {
    getContactsInfo(conversationId);
  }, []);

  useEffect(() => {
    if (contacts && contacts[conversationId]) {
      console.log('contacts[conversationId]', contacts[conversationId]);
      //const {organizationName, title, via:{email, phone}, address: {addressLine1, city}} = contacts[conversationId];
      const email = contacts[conversationId]?.via?.email;
      const phone = contacts[conversationId]?.via?.phone;
      const title = contacts[conversationId]?.title;
      const address = contacts[conversationId]?.address?.addressLine1;
      const organizationName = contacts[conversationId]?.organizationName;

      console.log('INFO', contacts[conversationId]?.title);

      if (email) setEmail(email);
      if (phone) setPhone(phone);
      if (title) setTitle(title);
      if (address) setAddress(address);
      if (organizationName) setOrganization(organizationName);
    }
  }, [contacts]);

  const InfoInput = ({infoDetail}) => {
    return <input type="text" placeholder={infoDetail} value={infoDetail} />;
  };

  const updateInfo = () => {

    const infoDetails: any = {
      id: contacts[conversationId].id
    };

    if (title !== 'title') infoDetails.title = title;
    if (organization !== 'company name') infoDetails.organization_name = organization;
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
      infoDetails.address.address_line1 = address;
    } 

    console.log('INFODETAILS', infoDetails);

    updateContactsInfo(conversationId, infoDetails);

    setEditingOn(false);
  };

  return (
    <section className={styles.container}>
      {!editingOn && <EditPencilIcon className={styles.editIcon} onClick={() => setEditingOn(true)} />}
      {editingOn && <CancelIcon fill="#737373" className={styles.editIcon} onClick={updateInfo} />}

      <h1>Contact</h1>
      <span>
        Email:{' '}
        {!editingOn ? (
          email
        ) : (
          <input type="text" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        )}
      </span>
      <span>
        Phone:
        {!editingOn ? (
          phone
        ) : (
          <input type="text" placeholder="phone" value={phone} onChange={e => setPhone(e.target.value)} />
        )}
      </span>
      <span>
        Title:{' '}
        {!editingOn ? (
          title
        ) : (
          <input type="text" placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
        )}
      </span>
      <span>
        Address:{' '}
        {!editingOn ? (
          address
        ) : (
          <input type="text" placeholder="address" value={address} onChange={e => setAddress(e.target.value)} />
        )}
      </span>
      <span>
        Organization:{' '}
        {!editingOn ? (
          organization
        ) : (
          <input
            type="text"
            placeholder="organization"
            value={organization}
            onChange={e => setOrganization(e.target.value)}
          />
        )}
      </span>
    </section>
  );
};

export default connector(ContactDetails);
