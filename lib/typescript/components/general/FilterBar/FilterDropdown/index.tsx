import React, {useRef, useState, useEffect, useCallback} from 'react';
import styles from './index.module.scss';
import {ReactComponent as ChevronDown} from 'assets/images/icons/chevronDown.svg';

const filterAttributes = [
  'Conversation Source',
  'Airy Product',
  'Subscription',
  'Feature Store',
  'Customer Service',
  'Machine Learning',
  'Conversational AI',
  'LLM',
  'Databases',
  'Marketing',
  'Storage',
  'Mobile Application',
];
const filterAvailability = ['Open Source', 'Managed Cloud', 'Enterprise'];

export const FilterDropdown = ({text, catalogAttributeFilter, onClick}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const componentEl = useRef(null);
  const buttonEl = useRef(null);

  const showDropdown = useCallback(
    dropdownVisible => {
      setDropdownVisible(dropdownVisible);
    },
    [dropdownVisible, setDropdownVisible, buttonEl]
  );

  const itemSelected = useCallback(
    option => {
      //showDropdown(false);
      onClick(option);
    },
    [onClick, showDropdown]
  );

  const keyDownHandler = useCallback(
    e => {
      if (e.key === 'Escape') {
        showDropdown(false);
      }
    },
    [showDropdown]
  );

  const eventHandler = useCallback(
    e => {
      if (componentEl.current && !componentEl.current.contains(e.target)) {
        showDropdown(false);
      }
    },
    [showDropdown]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('click', eventHandler, true);
    document.addEventListener('focus', eventHandler, true);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('click', eventHandler);
      document.removeEventListener('focus', eventHandler);
    };
  }, [document, eventHandler, keyDownHandler]);

  return (
    <div className={styles.component} ref={componentEl}>
      <button ref={buttonEl} className={styles.button} type="button" onClick={() => showDropdown(!dropdownVisible)}>
        <div>{text}</div>
        <ChevronDown className={`${styles.chevron} ${dropdownVisible ? styles.chevronRotated : ''}`} />
      </button>

      {dropdownVisible && (
        <div className={styles.dropDownWrapper}>
          <div className={styles.dropDown}>
            {filterAttributes.map(option => (
              <button type="button" key={option} className={styles.item} onClick={() => itemSelected(option)}>
                {option}
                <div
                  className={`${
                    catalogAttributeFilter && catalogAttributeFilter.includes(option)
                      ? styles.checkmarkChecked
                      : styles.checkmark
                  }`}
                ></div>
              </button>
            ))}
            <button type="button" key={'space'} className={styles.itemSpacing} />
            {filterAvailability.map(option => (
              <button type="button" key={option} className={styles.item} onClick={() => itemSelected(option)}>
                {option}
                <div
                  className={`${
                    catalogAttributeFilter && catalogAttributeFilter.includes(option)
                      ? styles.checkmarkChecked
                      : styles.checkmark
                  }`}
                ></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
