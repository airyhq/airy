import React from 'react';
import styles from './index.module.scss';

interface ContactInfoPointProps {
  editingOn:boolean;
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  infoName: string;
}

export const ContactInfoPoint = (props: ContactInfoPointProps) => {
  const {editingOn, email, setEmail, infoName} = props;
  const inputMode = infoName === 'email' ? 'email' : infoName === 'tel' ? 'tel' : 'text';

  const capitalizedInfoName = infoName.charAt(0).toUpperCase() + infoName.slice(1);


  //use Input
  return (
    <>
      <span className={editingOn ? styles.borderBlue : ''}>
        <span className={styles.detailName}>{capitalizedInfoName}:</span>
        {!editingOn ? (
          email
        ) : (
          <label htmlFor={infoName}>
            <input
              type={inputMode}
              inputMode={inputMode}
              name={infoName}
              autoComplete="off"
              autoFocus
              placeholder={infoName}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
        )}
      </span>
    </>
  );
};
