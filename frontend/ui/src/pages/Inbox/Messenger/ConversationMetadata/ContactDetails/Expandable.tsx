import React from 'react';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';
import {ReactComponent as ArrowDownIcon} from 'assets/images/icons/arrowDown.svg';
import styles from './index.module.scss';
import {cyContactExtendable} from 'handles';

interface ExpandableProps {
  toggleExpandableContent: () => void;
  infoPointsNum?: number;
  collapse?: boolean;
}

export const Expandable = (props: ExpandableProps) => {
  const {toggleExpandableContent, infoPointsNum, collapse} = props;

  return (
    <div className={styles.expandable} onClick={toggleExpandableContent} data-cy={cyContactExtendable}>
      {!collapse ? (
        <ArrowRightIcon className={styles.arrowIcon} />
      ) : (
        <ArrowDownIcon className={`${styles.arrowIcon} ${styles.downIcon}`} />
      )}
      {!collapse ? <span> See all ({infoPointsNum})</span> : <span> See less</span>}
    </div>
  );
};
