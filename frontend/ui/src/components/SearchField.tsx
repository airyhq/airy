import React, {createRef, useCallback} from 'react';

import closeIcon from 'assets/images/icons/close.svg';
import searchIcon from 'assets/images/icons/search.svg';
import styles from './index.module.scss';

type SearchFieldProps = {
  id?: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  resetClicked?: () => void;
  autoFocus?: boolean;
};

export const SearchField: React.FC<SearchFieldProps> = ({
  id,
  placeholder,
  value,
  setValue,
  resetClicked,
  autoFocus,
}: SearchFieldProps): JSX.Element => {
  const inputRef = createRef<HTMLInputElement>();
  const resetButton = useCallback(() => {
    setValue('');
    if (resetClicked) {
      resetClicked();
    }
  }, [value, setValue]);

  return (
    <div className={styles.component}>
      <div className={styles.searchIcon}>
        <img className={styles.searchIcon} src={searchIcon} />
      </div>
      <input
        ref={inputRef}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={event => setValue(event.target.value)}
        type="search"
        autoFocus={autoFocus}
      />
      {value !== '' && (
        <button className={styles.resetButton} onClick={resetButton} title="Reset Search">
          <img className={styles.closeIcon} src={closeIcon} />
        </button>
      )}
    </div>
  );
};
