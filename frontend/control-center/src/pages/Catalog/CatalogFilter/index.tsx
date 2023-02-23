import React, {Dispatch, SetStateAction} from 'react';
import styles from './index.module.scss';

type CatalogFilterProps = {
  catalogAttributeFilter: string[];
  setAttributeFilter: Dispatch<SetStateAction<string>>;
};

export const CatalogFilter = (props: CatalogFilterProps) => {
  const {catalogAttributeFilter} = props;

  return (
    <>
      {catalogAttributeFilter && catalogAttributeFilter.length > 0 && (
        <div className={styles.filterContainer}>
          {catalogAttributeFilter.map((attribute: string) => {
            return (
              <div className={styles.attribute} key={attribute}>
                {attribute}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
