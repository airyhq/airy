import React, {useState} from 'react';

import {enableDisableComponent} from '../../../actions';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/serviceUnhealthy.svg';
import {ReactComponent as ArrowRight} from 'assets/images/icons/arrowRight.svg';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {getComponentName} from '../../../services';
import {getSourceForComponent} from 'model';
import {SettingsModal, Button, Toggle} from 'components';
import styles from './index.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {useTranslation} from 'react-i18next';

type ComponentInfoProps = {
  healthy: boolean;
  itemName: string;
  isComponent: boolean;
  isExpanded: boolean;
  enabled?: boolean;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  enableDisableComponent,
};

const connector = connect(null, mapDispatchToProps);

const ItemInfo = (props: ComponentInfoProps) => {
  const {healthy, itemName, isComponent, isExpanded, enabled, enableDisableComponent} = props;
  const [channelSource] = useState(itemName && getSourceForComponent(itemName));
  const [componentName] = useState(itemName && getComponentName(itemName));
  const [componentEnabled, setComponentEnabled] = useState(enabled);
  const [enablePopupVisible, setEnablePopupVisible] = useState(false);
  const isVisible = isExpanded || isComponent;
  const {t} = useTranslation();

  const triggerEnableDisableAction = (enabled: boolean) => {
    enableDisableComponent({components: [{name: itemName, enabled: enabled}]});
    setComponentEnabled(enabled);
    setEnablePopupVisible(false);
  };

  const enableHandler = (enabled: boolean) => {
    if (enabled) {
      triggerEnableDisableAction(enabled);
      return;
    }

    setEnablePopupVisible(true);
  };

  return (
    <>
      {isVisible && (
        <div className={`${styles.container} ${!isComponent ? styles.expandedContainer : ''}`}>
          <div className={styles.name}>
            {isComponent ? (
              <>
                <div
                  className={`${styles.arrowDownIcon} ${
                    isExpanded ? styles.arrowDownIconOpen : styles.arrowDownIconClose
                  }`}
                >
                  <ArrowRight width={8} />
                </div>
                <div className={styles.icons}>{getChannelAvatar(channelSource)}</div>
              </>
            ) : (
              <div className={styles.blankSpace} />
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
              <Toggle value={componentEnabled} updateValue={enableHandler} size="small" variant="green" />
            </div>
          )}
        </div>
      )}

      {enablePopupVisible && (
        <SettingsModal
          wrapperClassName={styles.enableModalContainerWrapper}
          containerClassName={styles.enableModalContainer}
          title={t('disableComponent') + ' ' + componentName}
          close={() => setEnablePopupVisible(false)}
        >
          <p>{t('disableComponentText')}</p>
          <Button
            styleVariant="normal"
            style={{width: '45%'}}
            type="submit"
            onClick={() => triggerEnableDisableAction(false)}
          >
            {t('disableComponent')}
          </Button>
        </SettingsModal>
      )}
    </>
  );
};

export default connector(ItemInfo);
