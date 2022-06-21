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
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  //TO DO: add action to install/uninstall component
};

const connector = connect(null, mapDispatchToProps);

const InfoCard = (props: InfoCardProps) => {
  const {sourceInfo, addChannelAction, installed, style} = props;
  const [isInstalled, setIsInstalled] = useState(installed);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const buttonRef = useRef(null);
  const {t} = useTranslation();

  const installedVar = !installed ? t('installed') : t('uninstalled');

  const toggleInstallation = () => {
    //TO DO: add action to install/uninstall component
    setIsInstalled(!isInstalled)
    setIsModalVisible(true);
  }

  const addAction = (e: React.MouseEvent) => {
    console.log(e.currentTarget);
    //check event target here for install/uninstall

  //onClick={(e: React.MouseEvent) => addAction(e)}
    addChannelAction();
  };

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
          Icon={CheckmarkIcon as React.ElementType}
          wrapperClassName={styles.enableModalContainerWrapper}
          containerClassName={styles.enableModalContainer}
          title={sourceInfo.title + ' ' + installedVar}
          close={() => setIsModalVisible(false)}
          headerClassName={styles.headerModal}>
          {!installed && (
            <Button styleVariant="normal" type="submit" onClick={() => console.log('configure installation')}>
              {t('toConfigure')}
            </Button>
          )}
        </SettingsModal>
      )}
    </div>
  );
};

export default connector(InfoCard);
