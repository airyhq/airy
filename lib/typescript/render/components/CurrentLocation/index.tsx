import React from 'react';
import {Emoji} from 'components';
import styles from './index.module.scss';

interface CurrentLocationProps {
  longitude: string;
  latitude: string;
  name?: string;
  address?: string;
  fromContact: boolean;
}

export const CurrentLocation = ({longitude, latitude, name, address, fromContact}: CurrentLocationProps) => {
  if (!longitude) longitude = 'N/A';
  if (!latitude) latitude = 'N/A';

  return (
    <div className={`${fromContact ? styles.contactContent : styles.memberContent}`}>
      <p className={styles.text}>
        <Emoji symbol={'📍'} /> This user has shared its current location.
      </p>
      <br />
      <p className={styles.geolocation}>
        <a target="_blank" rel="noopener noreferrer" href={`http://maps.google.com/?q=${latitude},${longitude}`}>
          Latitude: {latitude}, Longitude: {longitude}
        </a>
      </p>
      {name && (
        <p className={styles.geolocation}>
          {name}{' '}
          {address && (
            <a target="_blank" rel="noopener noreferrer" href={`http://maps.google.com/?q=${address}`}>
              {address}
            </a>
          )}
        </p>
      )}
    </div>
  );
};
