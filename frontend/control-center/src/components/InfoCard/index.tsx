import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import {SourceInfo} from '../../../components/SourceInfo';
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
import {NotificationModel} from 'model';

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
  setNotification?: Dispatch<SetStateAction<NotificationModel>>;
  updateItemList?: (installed: boolean, componentName: string) => void;
  setIsInstalledToggled?: React.Dispatch<React.SetStateAction<boolean>>;
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
    setNotification,
    componentStatus,
    installComponent,
    uninstallComponent,
    updateItemList,
    setIsInstalledToggled,
  } = props;
  const [isInstalled, setIsInstalled] = useState(installed);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUninstalling, setIsUninstalling] = useState(false);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const CONNECTORS_PAGE = window.location.pathname.includes(CONNECTORS_ROUTE);

  useEffect(() => {
    const title = isInstalled ? t('uninstall') + ' ' + sourceInfo.title : sourceInfo.title + ' ' + t('installed');
    setModalTitle(title);
  }, [isInstalled]);

  const openInstallModal = () => {
    setIsInstalledToggled(true);
    isInstalled && setIsModalVisible(true);

    if (!isInstalled) {
      setIsInstalling(true);
      installComponent({name: `${sourceInfo.repository}/${sourceInfo.componentName}`})
        .then(() => {
          setNotification({show: true, successful: true, text: t('successfullyInstalled')});
          setIsModalVisible(true);
          toggleInstallation();
          setIsInstalling(false);
          setTimeout(() => {
            setNotification({show: false});
          }, 4000);
        })
        .catch(() => {
          setNotification({show: true, successful: false, text: t('failedInstall')});
          setIsInstalling(false);
          setTimeout(() => {
            setNotification({show: false});
          }, 4000);
        });
    }
  };

  const toggleInstallation = () => {
    setIsInstalled(!isInstalled);
  };

  const cancelInstallationToggle = () => {
    setIsModalVisible(false);
  };

  const confirmUninstall = () => {
    setIsUninstalling(true);
    uninstallComponent({name: `${sourceInfo.repository}/${sourceInfo.componentName}`})
      .then(() => {
        setNotification({show: true, successful: true, text: t('successfullyUninstalled')});
        toggleInstallation();
        setIsInstalling(false);
        setIsUninstalling(false);
        setTimeout(() => {
          setNotification({show: false});
        }, 4000);
      })
      .catch(() => {
        setNotification({show: true, successful: false, text: t('failedUninstall')});
        setIsUninstalling(false);
        setTimeout(() => {
          setNotification({show: false});
        }, 4000);
      });

    setIsModalVisible(false);
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
      `}>
      <div
        className={`
          ${styles.channelLogoTitleContainer} 
          ${style === InfoCardStyle.expanded ? styles.isExpandedContainer : ''}          
        `}>
        <div
          className={`
          ${styles.channelLogo}
          ${style === InfoCardStyle.expanded && styles.isExpandedLogo}
        `}>
          {sourceInfo.image}
        </div>
        <div
          className={`
          ${styles.textDetails}
          ${style === InfoCardStyle.expanded && styles.isExpandedDetails}
        `}>
          <h1>{sourceInfo.title}</h1>
        </div>
      </div>

      {CATALOG_PAGE && (
        <>
          {!installed && <p>{sourceInfo.description}</p>}
          <Button
            styleVariant={isInstalled ? 'outline' : 'extra-small'}
            type="submit"
            onClick={openInstallModal}
            disabled={isInstalling || isUninstalling}>
            {isInstalling
              ? t('installing')
              : isUninstalling
              ? t('uninstalling')
              : !isInstalled
              ? t('install')
              : t('uninstall')}
          </Button>
        </>
      )}

      {componentStatus && <ConfigStatusButton componentStatus={componentStatus} />}

      {isModalVisible && (
        <SettingsModal
          Icon={!isInstalled ? <CheckmarkIcon className={styles.checkmarkIcon} /> : null}
          wrapperClassName={styles.enableModalContainerWrapper}
          containerClassName={styles.enableModalContainer}
          title={modalTitle}
          close={cancelInstallationToggle}
          headerClassName={styles.headerModal}>
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
