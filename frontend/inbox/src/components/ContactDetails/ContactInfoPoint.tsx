import React, {useEffect, useState} from 'react';
import {getMaxInfoCharacterLength, getDataCy} from './util';
import {ContactIcon} from './ContactIcon';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();

  const [text, setText] = useState('');
  const type = infoName === 'email' ? 'email' : infoName === 'phone' ? 'tel' : 'text';
  const infoValue = email ?? phone ?? title ?? address ?? city ?? organization;
  const capitalizedInfoName = infoName.charAt(0).toUpperCase() + infoName.slice(1);
  const autoFocus = infoName === 'email' ? true : false;

  const getDisplayedtext = () => {
    const maxDisplayedLength = getMaxInfoCharacterLength();
    return infoValue?.length > maxDisplayedLength ? infoValue?.slice(0, maxDisplayedLength) + '...' : infoValue;
  };

  useEffect(() => {
    setText(getDisplayedtext());
  }, [infoValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regPhone = new RegExp('[^a-zA-Z]+$|^$');

    if (infoName === 'phone' && !regPhone.test(e.target.value)) {
      return;
    }

    switch (infoName) {
      case t('email'):
        setEmail(e.target.value);
        break;
      case t('phone'):
        setPhone(e.target.value);
        break;
      case t('title'):
        setTitle(e.target.value);
        break;
      case t('address'):
        setAddress(e.target.value);
        break;
      case t('city'):
        setCity(e.target.value);
        break;
      case t('organization'):
        setOrganization(e.target.value);
        break;
      default:
        return null;
    }
  };

  const InfoValue = () => {
    if (infoName === t('email') && infoValue !== t('email')) {
      return (
        <a
          target="_blank"
          rel="noopener noreferrer"
          data-cy={getDataCy(infoName)}
          className={styles.infoLink}
          href={`mailto:${infoValue}`}
          onMouseEnter={() => setText(infoValue)}
          onMouseLeave={() => setText(getDisplayedtext())}
        >
          {text}
        </a>
      );
    }

    if (infoName === t('address') && infoValue !== t('address')) {
      return (
        <a
          target="_blank"
          rel="noopener noreferrer"
          data-cy={getDataCy(infoName)}
          className={styles.infoLink}
          href={`http://maps.google.com/?q='${infoValue}`}
          onMouseEnter={() => setText(infoValue)}
          onMouseLeave={() => setText(getDisplayedtext())}
        >
          {text}
        </a>
      );
    }

    return (
      <div className={styles.textContainer}>
        <span
          className={styles.infoName}
          data-cy={getDataCy(infoName)}
          onMouseEnter={() => setText(infoValue)}
          onMouseLeave={() => setText(getDisplayedtext())}
        >
          {text}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className={`${styles.infoPointContainer} ${isEditing ? styles.borderBlue : ''}`}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconContainer}>
            {ContactIcon(infoName)}
            <span className={styles.detailName}>{capitalizedInfoName}:</span>
          </div>
        </div>

        {!isEditing ? (
          <InfoValue />
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
              maxLength={getMaxInfoCharacterLength(infoName)}
              data-cy={getDataCy(infoName)}
            />
          </label>
        )}
      </div>
    </>
  );
};
