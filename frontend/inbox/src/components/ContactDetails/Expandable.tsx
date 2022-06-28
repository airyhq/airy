import React from 'react';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';
import {ReactComponent as ArrowDownIcon} from 'assets/images/icons/arrowDown.svg';
import styles from './index.module.scss';
import {cyContactExtendable} from 'handles';
import {useTranslation} from 'react-i18next';

interface ExpandableProps {
  toggleExpandableContent: () => void;
  infoPointsNum?: number;
  collapse?: boolean;
}

export const Expandable = (props: ExpandableProps) => {
  const {toggleExpandableContent, infoPointsNum, collapse} = props;
  const {t} = useTranslation();

  return (
    <div className={styles.expandable} onClick={toggleExpandableContent} data-cy={cyContactExtendable}>
      {!collapse ? (
        <ArrowRightIcon className={`${styles.arrowIcon} ${styles.arrowRightIcon}`} />
      ) : (
        <ArrowDownIcon className={`${styles.arrowIcon} ${styles.downIcon}`} />
      )}
      {!collapse ? (
        <span>
          {' '}
          {t('seeAll')}({infoPointsNum})
        </span>
      ) : (
        <span>{t('seeLess')}</span>
      )}
    </div>
  );
};
