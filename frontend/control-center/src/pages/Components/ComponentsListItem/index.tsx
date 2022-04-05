import React, {useEffect, useState} from 'react';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/serviceUnhealthy.svg';
import styles from './index.module.scss';
import {Source} from 'model';
import {getChannelAvatar} from '../../../components/ChannelAvatar';

type ComponentsListProps = {
  healthy: boolean;
  serviceName: string;
};

export const ComponentListItem = (props: ComponentsListProps) => {
  const {healthy, serviceName} = props;
  const [connectorSource, setConnectorSource] = useState('');
  const [connectorSourceName, setConnectorSourceName] = useState('');

  useEffect(() => {
    if (serviceName.includes('twilio')) {
      setConnectorSource('twilio');
      setConnectorSourceName('Twilio');
    }
    if (serviceName.includes('google')) {
      setConnectorSource(Source.google);
      setConnectorSourceName('Google');
    }
    if (serviceName.includes('viber')) {
      setConnectorSource(Source.viber);
      setConnectorSourceName('Viber');
    }
    if (serviceName.includes('facebook')) {
      setConnectorSource(Source.facebook);
      setConnectorSourceName('Facebook');
    }
    if (serviceName.includes('frontend')) {
      setConnectorSource(Source.chatPlugin);
      setConnectorSourceName('Airy Inbox');
    }
    if (serviceName.includes('chat-plugin')) {
      setConnectorSource(Source.chatPlugin);
      setConnectorSourceName('Chat Plugin');
    }
    if (serviceName.includes('instagram')) {
      setConnectorSource(Source.instagram);
      setConnectorSourceName('Instagram');
    } else {
      const string = serviceName.replaceAll('-', ' ');
      setConnectorSourceName(string);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.icons}>{healthy ? <CheckmarkIcon /> : <UncheckedIcon />}</div>
      <p>{serviceName}</p>
      <div className={styles.componentName}>
        {getChannelAvatar(connectorSource)}
        <p>{connectorSourceName}</p>
      </div>
    </div>
  );
};
