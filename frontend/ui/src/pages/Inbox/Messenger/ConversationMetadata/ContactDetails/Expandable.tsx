import React from 'react';
import {ReactComponent as ArrowRight} from 'assets/images/icons/arrowRight.svg';
import styles from './index.module.scss';

interface ExpandableProps {
  toggleExpandableContent: () => void;
  infoPointsNum?: number;
  collapse?: boolean;
}

export const Expandable = (props: ExpandableProps) => {
  const {toggleExpandableContent, infoPointsNum, collapse} = props;

  return (
    <div className={styles.expandable} onClick={toggleExpandableContent}>
      <ArrowRight className={styles.arrowIcon} />{' '}
      {!collapse ? <span> See all ({infoPointsNum})</span> : <span> See less</span>}
    </div>
  );
};
