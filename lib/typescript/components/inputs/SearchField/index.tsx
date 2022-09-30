import React, {createRef, CSSProperties, useCallback} from 'react';

import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import styles from './style.module.scss';

type Props = {
  id?: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  resetClicked?: () => void;
  autoFocus?: boolean;
  dataCy?: string;
  className?: string;
  style?: CSSProperties;
};

export const SearchField = ({
  id,
  placeholder,
  value,
  setValue,
  resetClicked,
  autoFocus,
  dataCy,
  className,
  style,
}: Props) => {
  const inputRef = createRef<HTMLInputElement>();
  const resetButton = useCallback(() => {
    setValue('');
    if (resetClicked) {
      resetClicked();
    }
  }, [value, setValue]);

  return (
    <div className={`${className} ${styles.component}`} style={style}>
      <div className={styles.searchIcon}>
        <SearchIcon aria-hidden="true" className={styles.searchIcon} />
      </div>
      <input
        ref={inputRef}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={event => setValue(event.target.value)}
        type="search"
        autoFocus={autoFocus}
        data-cy={dataCy}
      />
      {value !== '' && (
        <button className={styles.resetButton} onClick={resetButton} title="Reset Search">
          <CloseIcon aria-hidden="true" className={styles.closeIcon} />
        </button>
      )}
    </div>
  );
};
