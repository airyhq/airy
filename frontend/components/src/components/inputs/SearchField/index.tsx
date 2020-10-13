import React, { createRef, useCallback } from "react";

import { AccessibleSVG } from "../../labels/AccessibleSVG";
import closeIcon from "../../../assets/images/icons/close.svg";
import searchIcon from "../../../assets/images/icons/search.svg";
import styles from "./style.module.scss";

type Props = {
  id?: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  resetClicked?: () => void;
  autoFocus?: boolean;
};

export const SearchField = ({
  id,
  placeholder,
  value,
  setValue,
  resetClicked,
  autoFocus
}: Props) => {
  const inputRef = createRef<HTMLInputElement>();
  const resetButton = useCallback(() => {
    setValue("");
    if (resetClicked) {
      resetClicked();
    }
  }, [value, setValue]);

  return (
    <div className={styles.component}>
      <AccessibleSVG
        ariaHidden="true"
        src={searchIcon}
        className={styles.searchIcon}
      />
      <input
        ref={inputRef}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={event => setValue(event.target.value)}
        type="search"
        autoFocus={autoFocus}
      />
      {value !== "" && (
        <button
          className={styles.resetButton}
          onClick={resetButton}
          title="Reset Search"
        >
          <AccessibleSVG
            ariaHidden="true"
            src={closeIcon}
            className={styles.closeIcon}
          />
        </button>
      )}
    </div>
  );
};
