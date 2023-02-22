import React, {Dispatch, SetStateAction} from 'react';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import styles from './index.module.scss';

type CatalogFilterProps = {
  catalogAttributeFilter: string[];
  setAttributeFilter: Dispatch<SetStateAction<string>>;
};

export const CatalogFilter = (props: CatalogFilterProps) => {
  const {catalogAttributeFilter, setAttributeFilter} = props;

  return (
    <>
      {catalogAttributeFilter && catalogAttributeFilter.length > 0 && (
        <div className={styles.filterContainer}>
          {catalogAttributeFilter.map((attribute: string) => {
            return <div className={styles.attribute}>{attribute}</div>;
          })}
        </div>
      )}
    </>
  );
};
