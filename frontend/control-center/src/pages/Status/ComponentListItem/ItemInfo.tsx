import React, {useState} from 'react';
import {StateModel} from '../../../reducers';
import {enableDisableComponent} from '../../../actions/config';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {ReactComponent as UncheckedIcon} from 'assets/images/icons/uncheckIcon.svg';
import {ReactComponent as ArrowRight} from 'assets/images/icons/arrowRight.svg';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {ConfigServices, Source} from 'model';
import {SettingsModal, Button, Toggle, Tooltip} from 'components';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';

type ComponentInfoProps = {
  healthy: boolean;
  itemName: string;
  isComponent: boolean;
  isExpanded: boolean;
  enabled?: boolean;
  setIsPopUpOpen: (value: boolean) => void;
  source?: Source;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  enableDisableComponent,
};

const connector = connect(null, mapDispatchToProps);

const ItemInfo = (props: ComponentInfoProps) => {
  const {source, healthy, itemName, isComponent, isExpanded, enabled, setIsPopUpOpen, enableDisableComponent} = props;
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const connectors = useSelector((state: StateModel) => state.data.connector);
  const [channelSource] = useState(source);
  const [componentName] = useState(itemName);
  const [componentEnabled, setComponentEnabled] = useState(enabled);
  const [enablePopupVisible, setEnablePopupVisible] = useState(false);
  const isVisible = isExpanded || isComponent;
  const {t} = useTranslation();

  const isConfigurableConnector = () => {
    let isConfigurable = false;

    Object.entries(catalogList).forEach(elem => {
      if (elem[1] && elem[1].source && elem[1].source === source) isConfigurable = true;
    });

    return isConfigurable;
  };

  const isComponentConfigured =
    connectors[itemName] && isConfigurableConnector() && Object.keys(connectors[itemName]).length > 0;

  //status
  const needsConfig =
    connector &&
    connectors[itemName] &&
    isComponent &&
    enabled &&
    healthy &&
    isConfigurableConnector() &&
    !isComponentConfigured &&
    itemName !== ConfigServices.sourcesChatPlugin;
  const isRunning = healthy && enabled;
  const isNotHealthy = !healthy && enabled;
  const isDisabled = !enabled;

  const triggerEnableDisableAction = (enabled: boolean) => {
    enableDisableComponent({components: [{name: itemName, enabled: enabled}]});
    setComponentEnabled(enabled);
    setEnablePopupVisible(false);
    setIsPopUpOpen(false);
  };

  const onEnableComponent = (enabled: boolean) => {
    if (enabled) {
      triggerEnableDisableAction(enabled);
      setIsPopUpOpen(false);
      return;
    }
    setEnablePopupVisible(true);
    setIsPopUpOpen(true);
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
            {needsConfig ? (
              <Tooltip
                hoverElement={<UncheckedIcon className={`${styles.icons} ${styles.installedNotConfigured}`} />}
                hoverElementHeight={20}
                hoverElementWidth={20}
                tooltipContent={t('needsConfiguration')}
              />
            ) : isRunning ? (
              <Tooltip
                hoverElement={<CheckmarkIcon className={`${styles.icons} ${styles.runningHealthy}`} />}
                hoverElementHeight={20}
                hoverElementWidth={20}
                tooltipContent={t('healthy')}
              />
            ) : isNotHealthy ? (
              <Tooltip
                hoverElement={<UncheckedIcon className={`${styles.icons} ${styles.unhealthy}`} />}
                hoverElementHeight={20}
                hoverElementWidth={20}
                tooltipContent={t('notHealthy')}
              />
            ) : (
              isDisabled && (
                <Tooltip
                  hoverElement={<UncheckedIcon className={`${styles.icons} ${styles.disabledHealthy}`} />}
                  hoverElementHeight={20}
                  hoverElementWidth={20}
                  tooltipContent={t('disabled')}
                />
              )
            )}
          </div>

          {isComponent && !needsConfig && (
            <div className={styles.enabled}>
              <Toggle value={componentEnabled} updateValue={onEnableComponent} size="small" variant="green" />
            </div>
          )}
        </div>
      )}

      {enablePopupVisible && (
        <SettingsModal
          wrapperClassName={styles.enableModalContainerWrapper}
          containerClassName={styles.enableModalContainer}
          title={t('disableComponent') + ' ' + componentName}
          close={() => {
            setEnablePopupVisible(false);
            setIsPopUpOpen(false);
          }}
        >
          <p className={styles.popUpSubtitle}>{t('disableComponentText')}</p>
          <Button
            styleVariant="normal"
            style={{padding: '0 60Px'}}
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
