import React from 'react';
import styles from './ChatPluginConnect.module.scss';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {CHANNELS_ROUTE} from '../../../routes/routes';

interface FacebookProps {
  channelId?: string;
}

const FacebookConnect = (props: RouteComponentProps<FacebookProps>) => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>Airy Live Chat</h1>

      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>

      <div>Yep {props.match.params.channelId}</div>
    </div>
  );
};

export default withRouter(FacebookConnect);