import React from 'react';
import {ReactComponent as Email} from 'assets/images/icons/email.svg';
import {ReactComponent as Phone} from 'assets/images/icons/phone.svg';
import {ReactComponent as Pencil} from 'assets/images/icons/pencil.svg';
import {ReactComponent as Home} from 'assets/images/icons/home.svg';
import {ReactComponent as Suitcase} from 'assets/images/icons/suitcase.svg';

import styles from './index.module.scss';

interface ContactInfoPointProps {
  editingOn: boolean;
  infoName: string;
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  phone?: string;
  setPhone?: React.Dispatch<React.SetStateAction<string>>;
  title?: string;
  setTitle?: React.Dispatch<React.SetStateAction<string>>;
  address?: string;
  setAddress?: React.Dispatch<React.SetStateAction<string>>;
  city?: string;
  setCity?: React.Dispatch<React.SetStateAction<string>>;
  organization?: string;
  setOrganization?: React.Dispatch<React.SetStateAction<string>>;
}

export const ContactInfoPoint = (props: ContactInfoPointProps) => {
  const {
    editingOn,
    infoName,
    email,
    setEmail,
    phone,
    setPhone,
    title,
    setTitle,
    address,
    setAddress,
    city,
    setCity,
    organization,
    setOrganization,
  } = props;

  const type = infoName === 'email' ? 'email' : infoName === 'phone' ? 'tel' : 'text';
  const infoValue = email ?? phone ?? title ?? address ?? city ?? organization;
  const capitalizedInfoName = infoName.charAt(0).toUpperCase() + infoName.slice(1);
  const autoFocus = infoName === 'email' ? true : false;

  const Icon = () => {
    switch (infoName) {
      case 'email':
        return <Email className={styles.infoIcon} />;
      case 'phone':
        return <Phone className={styles.infoIcon} />;
      case 'title':
        return <Pencil className={styles.infoIcon} />;
      case 'address':
      case 'city':
        return <Home className={styles.infoIcon} />;
      case 'organization':
        return <Suitcase className={styles.infoIcon} />;
      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (infoName) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'phone':
        setPhone(e.target.value);
        break;
      case 'title':
        setTitle(e.target.value);
        break;
      case 'address':
        setAddress(e.target.value);
        break;
      case 'city':
        setCity(e.target.value);
        break;
      case 'organization':
        setOrganization(e.target.value);
        break;
      default:
        return null;
    }
  };

  return (
    <>
      <span className={editingOn ? styles.borderBlue : ''}>
        <Icon />
        <span className={styles.detailName}>{capitalizedInfoName}:</span>
        {!editingOn ? (
          infoValue
        ) : (
          <label htmlFor={infoName}>
            <input
              type={type}
              inputMode={type}
              name={infoName}
              autoComplete="off"
              autoFocus={autoFocus}
              placeholder={infoName}
              value={infoValue}
              onChange={handleChange}
            />
          </label>
        )}
      </span>
    </>
  );
};
