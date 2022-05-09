import React, {useState} from 'react';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/serviceUnhealthy.svg';
import {ReactComponent as ArrowRight} from 'assets/images/icons/arrowRight.svg';
import {ReactComponent as ArrowDown} from 'assets/images/icons/arrowDown.svg';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {getComponentName} from '../../../services';
import {getSourceForComponent} from 'model';
import {Toggle} from 'components';
import styles from './index.module.scss';

type ComponentInfoProps = {
  healthy: boolean;
  itemName: string;
  isComponent: boolean;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  enabled?: boolean;
};

export const ItemInfo = (props: ComponentInfoProps) => {
  const {healthy, itemName, isComponent, isExpanded, setIsExpanded, enabled} = props;
  const [channelSource] = useState(itemName && getSourceForComponent(itemName));
  const [componentName] = useState(itemName && getComponentName(itemName));
  const [componentEnabled, setComponentEnabled] = useState(enabled);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.container} ${!isComponent ? styles.expandedContainer : ''}  ${
        !isComponent && isExpanded ? styles.expandedContainerShown : ''
      }`}>
      <div className={styles.name}>
        {isComponent && (
          <>
            <button onClick={toggleExpanded}>
              {!isExpanded ? <ArrowRight width={8} /> : <ArrowDown className={styles.arrowDownIcon} />}
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
