import React, {useRef, useState, useEffect, useCallback} from 'react';
import styles from './style.module.scss';
import {ReactComponent as ChevronDown} from 'assets/images/icons/chevronDown.svg';

export const Dropdown = ({text, options, variant, onClick}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const componentEl = useRef(null);
  const buttonEl = useRef(null);

  const styleFor = variant => {
    switch (variant) {
      case 'borderless':
        return styles.borderlessButton;
      default:
        return styles.button;
    }
  };

  const showDropdown = useCallback(
    dropdownVisible => {
      setDropdownVisible(dropdownVisible);
    },
    [dropdownVisible, setDropdownVisible, buttonEl]
  );

  const itemSelected = useCallback(
    option => {
      showDropdown(false);
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
      <button ref={buttonEl} className={styleFor(variant)} type="button" onClick={() => showDropdown(!dropdownVisible)}>
        <div>{text}</div>
        <ChevronDown className={`${styles.chevron} ${dropdownVisible ? styles.chevronRotated : ''}`} />
      </button>

      {dropdownVisible && (
        <div className={styles.dropDownWrapper}>
          <div className={styles.dropDown}>
            {options.map(option => (
              <button type="button" key={option} className={styles.item} onClick={() => itemSelected(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
