import React, {useState, useEffect} from 'react';
import {SourceInfo} from '../../../components/SourceInfo';
import {useNavigate} from 'react-router-dom';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {CATALOG_ROUTE, CONNECTORS_ROUTE} from '../../../routes/routes';
import {Button, SettingsModal} from 'components';
import {installComponent, uninstallComponent} from '../../../actions/catalog';
import {Source} from 'model';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {ConfigStatusButton} from '../ConfigStatusButton';
import styles from './index.module.scss';

export enum InfoCardStyle {
  normal = 'normal',
  expanded = 'expanded',
}

type InfoCardProps = {
  sourceInfo: SourceInfo;
  addChannelAction: () => void;
  installed: boolean;
  enabled?: 'Enabled' | 'Not Configured' | 'Disabled';
  style: InfoCardStyle;
  updateItemList?: (installed: boolean, type: Source) => void;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  installComponent,
  uninstallComponent,
};

const connector = connect(null, mapDispatchToProps);

const InfoCard = (props: InfoCardProps) => {
  const {
    sourceInfo,
    addChannelAction,
    installed,
    style,
    enabled,
    installComponent,
    uninstallComponent,
    updateItemList,
  } = props;
  const [isInstalled, setIsInstalled] = useState(installed);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const {t} = useTranslation();
  const navigate = useNavigate();
  const CONNECTORS_PAGE = window.location.pathname.includes(CONNECTORS_ROUTE);
  const CATALOG_PAGE = window.location.pathname.includes(CATALOG_ROUTE);

  useEffect(() => {
    const title = isInstalled ? t('uninstall') + ' ' + sourceInfo.title : sourceInfo.title + ' ' + t('installed');
    setModalTitle(title);
  }, [isInstalled]);

  const toggleInstallation = () => {
    setIsModalVisible(true);

    if (!isInstalled) {
      installComponent({name: `${sourceInfo.repository}/${sourceInfo.configKey}`});
    }
  };

  const cancelInstallationToggle = () => setIsModalVisible(false);

  const confirmInstallationToggle = () => {
    if (isInstalled) {
      uninstallComponent({name: `${sourceInfo.repository}/${sourceInfo.configKey}`});
    }
    setIsModalVisible(false);
    setIsInstalled(!isInstalled);
    updateItemList(!isInstalled, sourceInfo.type);
  };

  const handleCardClick = () => {
    navigate(sourceInfo.newChannelRoute);
  };

  return (
    <div
      onClick={CONNECTORS_PAGE ? handleCardClick : null}
      className={`
        ${styles.channelCard} 
        ${
          style === InfoCardStyle.expanded
            ? styles.isExpandedContainer
            : installed
            ? styles.installed
            : styles.notInstalled
        } 
        ${CONNECTORS_PAGE ? styles.cardConnectors : ''}
      `}
    >
      <div
        className={`
          ${styles.channelLogoTitleContainer} 
          ${style === InfoCardStyle.expanded ? styles.isExpandedContainer : ''}          
        `}
      >
        <div
          className={`
          ${styles.channelLogo}
          ${style === InfoCardStyle.expanded && styles.isExpandedLogo}
        `}
        >
          {sourceInfo.image}
        </div>
        <div
          className={`
          ${styles.textDetails}
          ${style === InfoCardStyle.expanded && styles.isExpandedDetails}
        `}
        >
          <h1>{sourceInfo.title}</h1>
        </div>
      </div>

      {CATALOG_PAGE && (
        <>
          {!installed && <p>{sourceInfo.description}</p>}
          <Button styleVariant={isInstalled ? 'outline' : 'extra-small'} type="submit" onClick={toggleInstallation}>
            {!isInstalled ? t('install') : t('uninstall')}
          </Button>
        </>
      )}

      {enabled && <ConfigStatusButton enabled={enabled} />}

      {isModalVisible && (
        <SettingsModal
          Icon={!isInstalled ? (CheckmarkIcon as React.ElementType) : null}
          wrapperClassName={styles.enableModalContainerWrapper}
          containerClassName={styles.enableModalContainer}
          title={modalTitle}
          close={cancelInstallationToggle}
          headerClassName={styles.headerModal}
        >
          {isInstalled && <p> {t('uninstallComponentText')} </p>}
          {!isInstalled ? (
            <Button styleVariant="normal" type="submit" onClick={addChannelAction}>
              {t('toConfigure')}
            </Button>
          ) : (
            <Button styleVariant="normal" type="submit" onClick={confirmInstallationToggle}>
              {t('uninstall')}
            </Button>
          )}
        </SettingsModal>
      )}
    </div>
  );
};

export default connector(InfoCard);
