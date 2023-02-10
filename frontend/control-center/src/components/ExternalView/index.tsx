import React from 'react';

import styles from './index.module.scss';

interface IProps {
  url: string;
}

const ExternalWrapper: React.FunctionComponent<IProps> = props => (
  <div className={styles.container}>
    <iframe src={props.url}></iframe>
  </div>
);

export default ExternalWrapper;
