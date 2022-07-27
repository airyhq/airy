import React, {useState} from 'react';
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

}

export const TabPanel = (props: TabsPanelProps) => {
  const {PageContentOne, PageContentTwo, PageContentThree} = props;
  const [currentPage, setCurrentPage] = useState('');

  const showPageOne = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
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
        return PageContentTwo
      case Pages.pageThree:
        return PageContentThree;
    }
  };

  return (
    <div className={styles.wrapper} style={{width: '60%'}}>
      <div className={styles.channelsLineContainer}>
        <div className={styles.channelsLineItems}>
          <span
            className={currentPage === Pages.pageOne ? styles.activeItem : styles.inactiveItem}
            onClick={showPageOne}>
          </span>
          <span
            className={currentPage === Pages.pageTwo ? styles.activeItem : styles.inactiveItem}
            onClick={showPageTwo}>
          </span>

          {PageContentThree && (
            <span
              className={currentPage === Pages.pageThree ? styles.activeItem : styles.inactiveItem}
              onClick={showPageThree}>
            </span>
          )}
        </div>
        <div className={styles.line} />
        <PageContent />
      </div>
      <div></div>
    </div>
  );
};
