import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';

import {ReactComponent as ChevronLeft} from 'assets/images/icons/chevronLeft.svg';
import {ReactComponent as ChevronRight} from 'assets/images/icons/chevronRight.svg';
import {useTranslation} from 'react-i18next';

type PaginationType = {
  totalCount: number;
  pageCount: number;
  pageSize: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
  onSearch?: boolean;
};

export const Pagination = (props: PaginationType) => {
  const {totalCount, pageCount, currentPage, onPageChange, onSearch, pageSize} = props;
  const [displayedItems, setDisplayedItems] = useState([1, pageCount]);
  const [endReached, setEndReached] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    currentPage * pageCount + pageCount > totalCount ? setEndReached(true) : setEndReached(false);
    pageCount < pageSize && !onSearch && setDisplayedItems([1, pageSize]);
  }, [currentPage, pageCount, onSearch]);

  const onNext = () => {
    onPageChange(currentPage + 1);
    endReached
      ? setDisplayedItems([1 + pageCount * currentPage, totalCount])
      : setDisplayedItems([1 + pageCount * currentPage, pageCount + pageCount * currentPage]);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
    setDisplayedItems([1 + pageCount * currentPage - pageCount * 2, pageCount * currentPage - pageCount]);
  };

  return (
    <div className={styles.container} style={{display: 'flex', flex: 1, marginTop: '30px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}>
        <div className={styles.pages}>
          <span>
            {onSearch
              ? `${totalCount} `
              : pageCount === 0
              ? `${pageCount} `
              : `${displayedItems[0]} - ${displayedItems[1]} `}
          </span>
          <span>
            {t('of')} {totalCount}
          </span>
        </div>
        {totalCount > pageCount && (
          <div className={styles.buttons}>
            <button
              onClick={onPrevious}
              disabled={currentPage === 1 || onSearch}
              style={currentPage === 1 || onSearch ? {visibility: 'hidden'} : {}}
            >
              <ChevronLeft height={15} />
            </button>
            <button
              onClick={onNext}
              disabled={currentPage === Math.round(totalCount / pageCount) || onSearch}
              style={currentPage === Math.round(totalCount / pageCount) || onSearch ? {visibility: 'hidden'} : {}}
            >
              <ChevronRight height={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
