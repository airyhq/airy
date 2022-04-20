import React, {useEffect, useState} from 'react';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/serviceUnhealthy.svg';
import {ReactComponent as ArrowRight} from 'assets/images/icons/arrowRight.svg';
import {ReactComponent as ArrowDown} from 'assets/images/icons/arrowDown.svg';
import styles from './index.module.scss';
import {Source} from 'model';
import {getChannelAvatar} from '../../../components/ChannelAvatar';

type ComponentsListProps = {
  healthy: boolean;
  componentName: string;
  services?: any;
};

export const ComponentListItem = (props: ComponentsListProps) => {
  const {healthy, componentName, services} = props;
  const [channelSource, setChannnelSource] = useState('');
  const [channelSourceName, setChannelSourceName] = useState('');
  const [expanded, setExpanded] = useState(false);

  console.log('props', props);

  useEffect(() => {
    if (componentName.includes('twilio')) {
      setChannnelSource('twilio');
      setChannelSourceName('Twilio');
      return;
    }
    if (componentName.includes('google')) {
      setChannnelSource(Source.google);
      setChannelSourceName('Google');
      return;
    }
    if (componentName.includes('viber')) {
      setChannnelSource(Source.viber);
      setChannelSourceName('Viber');
      return;
    }
    if (componentName.includes('facebook')) {
      setChannnelSource(Source.facebook);
      setChannelSourceName('Facebook');
      return;
    }
    if (componentName.includes('frontend')) {
      setChannnelSource(Source.chatPlugin);
      setChannelSourceName('Airy Inbox');
      return;
    }
    if (componentName.includes('chat-plugin')) {
      setChannnelSource(Source.chatPlugin);
      setChannelSourceName('Chat Plugin');
      return;
    }

    if (componentName.includes('instagram')) {
      setChannnelSource(Source.instagram);
      setChannelSourceName('Instagram');
      return;
    }

    const string = componentName.replaceAll('-', ' ');
    setChannelSourceName(string);
  }, []);

  //on expand: container height: auto

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <section className={`${styles.wrapper} ${expanded ? styles.wrapperExpanded : styles.wrapperCollapsed}`}>
      
      <div className={styles.container}>
        <div className={styles.componentName}>
          <button onClick={toggleExpanded}>
            {!expanded ? <ArrowRight className={styles.icons} /> : <ArrowDown className={styles.arrowDownIcon} />}
          </button>
          {getChannelAvatar(channelSource)}
          <p className={styles.channelSourceName}>{channelSourceName}</p>
        </div>

        <div className={styles.healthyStatus}>{healthy ? <CheckmarkIcon /> : <UncheckedIcon />}</div>
        <div className={styles.enabled}><div className={styles.toggle}></div></div> 
      </div>

      {expanded && (
        <>
          {services.map(service => (
            <div className={`${styles.container} ${styles.expandedContainer}`}>
              <div className={styles.componentName}>
                <p className={styles.serviceName}>{service.name}</p>
              </div>
              <div className={styles.healthyStatus}>{service.healthy ? <CheckmarkIcon /> : <UncheckedIcon />}</div>
            </div>
          ))}
        </>
      )}
    </section>
  );
};
