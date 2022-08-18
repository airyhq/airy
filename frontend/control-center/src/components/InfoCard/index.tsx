import React, {useState, useEffect} from 'react';
import {SourceInfo} from '../SourceInfo';
import {useNavigate} from 'react-router-dom';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {CONNECTORS_ROUTE} from '../../routes/routes';
import {Button, SettingsModal} from 'components';
import {installComponent, uninstallComponent} from '../../actions/catalog';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {ConfigStatusButton} from '../../pages/Connectors/ConfigStatusButton';
import {ComponentStatus} from '../../pages/Connectors';
import styles from './index.module.scss';

export enum InfoCardStyle {
  normal = 'normal',
  expanded = 'expanded',
}

type InfoCardProps = {
  sourceInfo: SourceInfo;
  addChannelAction: () => void;
  installed: boolean;
  componentStatus?: ComponentStatus;
  style: InfoCardStyle;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  installComponent,
  uninstallComponent,
};

const connector = connect(null, mapDispatchToProps);

const InfoCard = (props: InfoCardProps) => {
  const {sourceInfo, addChannelAction, installed, style, uninstallComponent, componentStatus} = props;
  const [isInstalled, setIsInstalled] = useState(installed);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const {t} = useTranslation();
  const navigate = useNavigate();
  const CONNECTORS_PAGE = window.location.pathname.includes(CONNECTORS_ROUTE);

  useEffect(() => {
    const title = isInstalled ? t('uninstall') + ' ' + sourceInfo.title : sourceInfo.title + ' ' + t('installed');
    setModalTitle(title);
  }, [isInstalled]);

  const toggleInstallation = () => {
    setIsInstalled(!isInstalled);
  };

  const cancelInstallationToggle = () => {
    setIsModalVisible(false);

    if (!isInstalled) toggleInstallation();
  };

  const confirmUninstall = () => {
    uninstallComponent({name: `${sourceInfo.repository}/${sourceInfo.componentName}`});

    setIsModalVisible(false);
    toggleInstallation();
  };

  const handleCardClick = () => {
    navigate(sourceInfo.newChannelRoute);
  };

  return (
    <div
      onClick={CONNECTORS_PAGE ? handleCardClick : null}
      className={`
        ${styles.infoCard} 
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

      {componentStatus && <ConfigStatusButton componentStatus={componentStatus} />}

      {isModalVisible && (
        <SettingsModal
          Icon={!isInstalled ? <CheckmarkIcon className={styles.checkmarkIcon} /> : null}
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
            <Button styleVariant="normal" type="submit" onClick={confirmUninstall}>
              {t('uninstall')}
            </Button>
          )}
        </SettingsModal>
      )}
    </div>
  );
};

export default connector(InfoCard);
