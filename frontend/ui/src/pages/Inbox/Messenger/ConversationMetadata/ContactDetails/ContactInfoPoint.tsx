import React from 'react';
import {ReactComponent as EmailIcon} from 'assets/images/icons/email.svg';
import {ReactComponent as PhoneIcon} from 'assets/images/icons/phone.svg';
import {ReactComponent as PencilIcon} from 'assets/images/icons/pencil.svg';
import {ReactComponent as HomeIcon} from 'assets/images/icons/home.svg';
import {ReactComponent as SuitcaseIcon} from 'assets/images/icons/suitcase.svg';
import {
  cyContactEmail,
  cyContactPhone,
  cyContactTitle,
  cyContactAddress,
  cyContactCity,
  cyContactOrganization,
} from 'handles';
import styles from './index.module.scss';

interface ContactInfoPointProps {
  isEditing: boolean;
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
    isEditing,
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

  const getDataCy = () => {
    switch (infoName) {
      case 'email':
        return cyContactEmail;
      case 'phone':
        return cyContactPhone;
      case 'title':
        return cyContactTitle;
      case 'address':
        return cyContactAddress;
      case 'city':
        return cyContactCity;
      case 'organization':
        return cyContactOrganization;
      default:
        return null;
    }
  };

  const getMaxLength = () => {
    switch (infoName) {
      case 'email':
      case 'address':
        return 50;
      case 'phone':
        return 15;
      case 'title':
        return 25;
      case 'city':
        return 30;
      case 'organization':
        return 45;
      default:
        return null;
    }
  };

  const Icon = () => {
    switch (infoName) {
      case 'email':
        return <EmailIcon className={styles.infoIcon} />;
      case 'phone':
        return <PhoneIcon className={styles.infoIcon} />;
      case 'title':
        return <PencilIcon className={styles.infoIcon} />;
      case 'address':
      case 'city':
        return <HomeIcon className={styles.infoIcon} />;
      case 'organization':
        return <SuitcaseIcon className={styles.infoIcon} />;
      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regPhone = new RegExp('[^a-zA-Z]+$|^$');

    if (infoName === 'phone' && !regPhone.test(e.target.value)) {
      return;
    }

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
      <div className={`${styles.infoPointContainer} ${isEditing ? styles.borderBlue : ''}`}>
        <Icon />
        <span className={styles.detailName}>{capitalizedInfoName}:</span>
        {!isEditing ? (
          <span className={styles.infoName} data-cy={getDataCy()}>
            {infoValue}
          </span>
        ) : (
          <label htmlFor={infoName}>
            <input
              type={type}
              id={infoName}
              name={infoName}
              inputMode={type}
              autoComplete="off"
              autoFocus={autoFocus}
              placeholder={infoName}
              value={infoValue}
              onChange={handleChange}
              maxLength={getMaxLength()}
              data-cy={getDataCy()}
            />
          </label>
        )}
      </div>
    </>
  );
};
