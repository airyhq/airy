import React, {useState, useRef} from 'react';
import {SourceInfo} from '../../../components/SourceInfo';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {Button, SettingsModal} from 'components';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';

export enum InfoCardStyle {
  normal = 'normal',
  expanded = 'expanded',
}

type InfoCardProps = {
  sourceInfo: SourceInfo;
  addChannelAction: () => void;
  installed: boolean;
  style: InfoCardStyle;
  updateItemList:any;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  //TO DO: add action to install/uninstall component
};

const connector = connect(null, mapDispatchToProps);

const InfoCard = (props: InfoCardProps) => {
  const {sourceInfo, addChannelAction, installed, style, updateItemList} = props;
  const [isInstalled, setIsInstalled] = useState(installed);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const buttonRef = useRef(null);
  const {t} = useTranslation();

  const installedVar = !installed ? t('installed') : t('uninstalled');

  const toggleInstallation = () => {
    //TO DO: add action to install/uninstall component

    setIsModalVisible(true);
  }

  const addAction = (e: React.MouseEvent) => {
    console.log(e.currentTarget);
    //check event target here for install/uninstall

  //onClick={(e: React.MouseEvent) => addAction(e)}
    addChannelAction();
  };

  const cancelInstallationToggle = () => {
     //for installing components, we install even if the user passes the config
     if(!isInstalled){
      confirmInstallationToggle()
     } 

    setIsModalVisible(false)
  }

  const confirmInstallationToggle = () => {
    setIsInstalled(!isInstalled);
    updateItemList(!isInstalled, sourceInfo.type)
  }

  return (
    <div
      className={`
        ${styles.channelCard} 
        ${
          style === InfoCardStyle.expanded
            ? styles.isExpandedContainer
            : installed
            ? styles.installed
            : styles.notInstalled
        } 
      `}>
      <div
        className={`
          ${styles.channelLogoTitleContainer} 
          ${
            style === InfoCardStyle.expanded
              ? styles.isExpandedContainer
              : installed
              ? styles.channelLogoTitleContainerInstalled
              : styles.channelLogoTitleContainerNotInstalled
          }          
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
      {!installed && <p>{sourceInfo.description}</p>}
      <Button
        styleVariant={isInstalled ? 'outline' : 'extra-small'}
        type="submit"
        onClick={toggleInstallation}>
        {!isInstalled ? t('install') : t('uninstall')}
      </Button>

      {isModalVisible && (
        <SettingsModal
          Icon={!installed ? CheckmarkIcon as React.ElementType : null}
          wrapperClassName={styles.enableModalContainerWrapper}
          containerClassName={styles.enableModalContainer}
          title={sourceInfo.title + ' ' + installedVar}
          close={cancelInstallationToggle}
          headerClassName={styles.headerModal}>
          {installed && (
            <p> Are you sure you want to uninstall this component? </p>
          )}
          {!installed ? (
            <Button styleVariant="normal" type="submit" onClick={() => console.log('configure installation')}>
              {t('toConfigure')}
            </Button>
          ): (
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
