import React, {useState, useRef} from 'react';
import {SourceInfo} from '../../../components/SourceInfo';
import {Button, SettingsModal} from 'components';
import {useTranslation} from 'react-i18next';
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
};

const InfoCard = (props: InfoCardProps) => {
  const {sourceInfo, addChannelAction, installed, style} = props;
  const [isInstallationToggled, setIsInstallationToggled] = useState(false);
  const buttonRef = useRef(null);
  const {t} = useTranslation();
  const installVar = !installed ? t('install') : t('uninstall');

  const install = () => {
    console.log('INSTALL');
  };

  const uninstall = () => {
    console.log('UNINSTALL');
  };

  const addAction = (e: React.MouseEvent) => {
    console.log(e.currentTarget)
    //check event target here for install/uninstall 
    addChannelAction()
  }

  //onClick={(e: React.MouseEvent) => addAction(e)}

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
            styleVariant={installed ? 'outline' : 'extra-small'}
            type="submit"
            onClick={() => setIsInstallationToggled(true)}
            buttonRef={buttonRef}>
            {installVar}
          </Button>

          {isInstallationToggled && (
            <SettingsModal
              wrapperClassName={styles.enableModalContainerWrapper}
              containerClassName={styles.enableModalContainer}
              title={sourceInfo.title + ' ' + installVar}
              close={() => setIsInstallationToggled(false)}>
              {!installed && (
                <Button
                  styleVariant="normal"
                  type="submit"
                  onClick={() => console.log('configure installation')}>
                  {t('toConfigure')}
                </Button>
              )}
            </SettingsModal>
          )}
    </div>
  );
};

export default InfoCard;
