import React, {useEffect, useState} from 'react';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/serviceUnhealthy.svg';
import {ReactComponent as ArrowRight} from 'assets/images/icons/arrowRight.svg';
import {ReactComponent as ArrowDown} from 'assets/images/icons/arrowDown.svg';
import styles from './index.module.scss';
import {Source} from 'model';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {capitalizeTitle} from '../../../services';
import {Toggle} from 'components';

type ComponentInfoProps = {
  healthy: boolean;
  itemName: string;
  isComponent: boolean;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ItemInfo = (props: ComponentInfoProps) => {
  const {healthy, itemName, isComponent, isExpanded, setIsExpanded} = props;
  const [channelSource, setChannnelSource] = useState('');
  const [componentName, setComponentName] = useState('');
  const [componentEnabled, setComponentEnabled] = useState(false);

  useEffect(() => {
    if (itemName.includes('twilio')) {
      setChannnelSource('twilio');
      setComponentName('Twilio');
      return;
    }
    if (itemName.includes('google')) {
      setChannnelSource(Source.google);
      setComponentName('Google');
      return;
    }
    if (itemName.includes('viber')) {
      setChannnelSource(Source.viber);
      setComponentName('Viber');
      return;
    }
    if (itemName.includes('facebook')) {
      setChannnelSource(Source.facebook);
      setComponentName('Facebook');
      return;
    }
    if (itemName.includes('frontend')) {
      setChannnelSource(Source.chatPlugin);
      setComponentName('Airy Inbox');
      return;
    }
    if (itemName.includes('chat-plugin')) {
      setChannnelSource(Source.chatPlugin);
      setComponentName('Chat Plugin');
      return;
    }

    if (itemName.includes('instagram')) {
      setChannnelSource(Source.instagram);
      setComponentName('Instagram');
      return;
    }

    if (itemName.includes('zendesk')) {
      setChannnelSource(Source.zendesk);

      if (!itemName.includes('enterprise')) {
        setComponentName('Zendesk');
        return;
      }
    }

    if (itemName.includes('dialogflow')) {
      setChannnelSource(Source.dialogflow);
    }

    const formattedName = itemName.replaceAll('-', ' ');
    const capitalizedFormattedName = capitalizeTitle(formattedName);
    setComponentName(capitalizedFormattedName);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.container} ${!isComponent ? styles.expandedContainer : ''}`}>
      <div className={styles.name}>
        {isComponent && (
          <>
            <button onClick={toggleExpanded}>
              {!isExpanded ? <ArrowRight /> : <ArrowDown className={styles.arrowDownIcon} />}
            </button>
            <div className={styles.icons}>{getChannelAvatar(channelSource)}</div>
          </>
        )}

        <p className={`${isComponent ? styles.componentName : styles.serviceName}`}>
          {isComponent ? componentName : itemName}
        </p>
      </div>

      <div className={styles.healthyStatus}>
        {healthy ? <CheckmarkIcon className={styles.icons} /> : <UncheckedIcon className={styles.icons} />}
      </div>

      {isComponent && (
        <div className={styles.enabled}>
          <Toggle value={componentEnabled} updateValue={setComponentEnabled} size="small" variant="green" />
        </div>
      )}
    </div>
  );
};
