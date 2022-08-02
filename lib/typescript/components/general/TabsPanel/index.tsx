import React, {useState, useEffect} from 'react';
import styles from './index.module.scss';

export enum Pages {
  pageOne = 'pageOne',
  pageTwo = 'pageTwo',
  pageThree = 'pageThree',
}

interface TabsPanelProps {
  PageContentOne: any;
  PageContentTwo: any;
  PageContentThree?: any;
  pageTitleOne: string;
  pageTitleTwo: string;
  pageTitleThree?: string;
}

export const TabPanel = (props: TabsPanelProps) => {
  const {PageContentOne, PageContentTwo, PageContentThree, pageTitleOne, pageTitleTwo, pageTitleThree} = props;
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    showPageOne();
  }, []);

  const showPageOne = (event?: React.MouseEvent<HTMLAnchorElement>) => {
    if (event) event.preventDefault();
    setCurrentPage(Pages.pageOne);
  };

  const showPageTwo = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(Pages.pageTwo);
  };

  const showPageThree = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(Pages.pageThree);
  };

  const PageContent = () => {
    switch (currentPage) {
      case Pages.pageOne:
        return PageContentOne;
      case Pages.pageTwo:
        return PageContentTwo;
      case Pages.pageThree:
        return PageContentThree;
    }
  };

  return (
    <div className={styles.tabsPanelWrapper}>
      <div className={styles.tabsPanelContainer}>
        <div className={styles.tabsPanelItems}>
          <span
            className={currentPage === Pages.pageOne ? styles.activeTabItem : styles.inactiveTabItem}
            onClick={showPageOne}
          >
            {pageTitleOne}
          </span>
          <span
            className={currentPage === Pages.pageTwo ? styles.activeTabItem : styles.inactiveTabItem}
            onClick={showPageTwo}
          >
            {pageTitleTwo}
          </span>

          {PageContentThree && (
            <span
              className={currentPage === Pages.pageThree ? styles.activeTabItem : styles.inactiveTabItem}
              onClick={showPageThree}
            >
              {pageTitleThree}
            </span>
          )}
        </div>
        <div className={styles.line} />
        <PageContent />
      </div>
    </div>
  );
};
