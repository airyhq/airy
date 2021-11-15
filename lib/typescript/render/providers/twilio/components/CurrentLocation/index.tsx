import React from 'react';
import {Emoji} from 'components';
import styles from './index.module.scss';

export const CurrentLocation = ({longitude, latitude, fromContact}) => {
  return (
    <div className={`${fromContact ? styles.contactContent : styles.memberContent}`}>
      <span className={styles.text}>
        <Emoji symbol={'📍'} /> This user has shared its current location.
      </span>
      <br />
      <span className={styles.geolocation}>
        {' '}
        Latitude: {latitude}, Longitude: {longitude}
      </span>
    </div>
  );
};
