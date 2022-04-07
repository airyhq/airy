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
  const [channelSource, setChannnelSource] = useState('');
  const [channelSourceName, setChannelSourceName] = useState('');

  useEffect(() => {
    if (serviceName.includes('twilio')) {
      setChannnelSource('twilio');
      setChannelSourceName('Twilio');
    }
    if (serviceName.includes('google')) {
      setChannnelSource(Source.google);
      setChannelSourceName('Google');
    }
    if (serviceName.includes('viber')) {
      setChannnelSource(Source.viber);
      setChannelSourceName('Viber');
    }
    if (serviceName.includes('facebook')) {
      setChannnelSource(Source.facebook);
      setChannelSourceName('Facebook');
    }
    if (serviceName.includes('frontend')) {
      setChannnelSource(Source.chatPlugin);
      setChannelSourceName('Airy Inbox');
    }
    if (serviceName.includes('chat-plugin')) {
      setChannnelSource(Source.chatPlugin);
      setChannelSourceName('Chat Plugin');
    }
    if (serviceName.includes('instagram')) {
      setChannnelSource(Source.instagram);
      setChannelSourceName('Instagram');
    } else {
      const string = serviceName.replaceAll('-', ' ');
      setChannelSourceName(string);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.icons}>{healthy ? <CheckmarkIcon /> : <UncheckedIcon />}</div>
      <p>{serviceName}</p>
      <div className={styles.componentName}>
        {getChannelAvatar(channelSource)}
        <p>{channelSourceName}</p>
      </div>
    </div>
  );
};
