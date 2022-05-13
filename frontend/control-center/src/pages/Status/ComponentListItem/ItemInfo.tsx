import React, {useState} from 'react';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/serviceUnhealthy.svg';
import {ReactComponent as ArrowRight} from 'assets/images/icons/arrowRight.svg';
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
  enabled?: boolean;
};

export const ItemInfo = (props: ComponentInfoProps) => {
  const {healthy, itemName, isComponent, isExpanded, enabled} = props;
  const [channelSource] = useState(itemName && getSourceForComponent(itemName));
  const [componentName] = useState(itemName && getComponentName(itemName));
  const [componentEnabled, setComponentEnabled] = useState(enabled);

  return (
    <div
      className={`${styles.container} ${!isComponent ? styles.expandedContainer : ''}  ${
        !isComponent && isExpanded ? styles.expandedContainerShown : ''
      }`}
    >
      <div className={styles.name}>
        {isComponent ? (
          <>
            <div
              className={`${styles.arrowDownIcon} ${isExpanded ? styles.arrowDownIconOpen : styles.arrowDownIconClose}`}
            >
              <ArrowRight width={8} />
            </div>
            <div className={styles.icons}>{getChannelAvatar(channelSource)}</div>
          </>
        ) : (
          <>
            <div className={styles.blankSpace} />
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
