import React, {useState, useEffect} from 'react';
import {SourceInfo} from '../../../components/SourceInfo';
import {useNavigate} from 'react-router-dom';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {CATALOG_ROUTE, CONNECTORS_ROUTE} from '../../../routes/routes';
import {Button, SettingsModal} from 'components';
import {installComponent, uninstallComponent} from '../../../actions/catalog';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {ConfigStatusButton} from '../../../pages/Connectors/ConfigStatusButton';
import {Source} from 'model';
import {
  CONNECTORS_FACEBOOK_ROUTE,
  CONNECTORS_TWILIO_SMS_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_CHAT_PLUGIN_ROUTE,
  CONNECTORS_GOOGLE_ROUTE,
  CONNECTORS_INSTAGRAM_ROUTE,
  CONNECTORS_DIALOGFLOW_ROUTE,
  CONNECTORS_ZENDESK_ROUTE,
  CONNECTORS_SALESFORCE_ROUTE,
} from '../../../routes/routes';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {findSourceForComponent} from '../index';
import styles from './index.module.scss';

export enum InfoCardStyle {
  normal = 'normal',
  expanded = 'expanded',
}

type InfoCardProps = {
  componentInfo?: any;
  addChannelAction?: () => void;
  installed?: boolean;
  enabled?: 'Enabled' | 'Not Configured' | 'Disabled';
  style?: InfoCardStyle;
  updateItemList?: (installed: boolean, componentName: string) => void;
  setIsInstalledToggled?: React.Dispatch<React.SetStateAction<boolean>>;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  installComponent,
  uninstallComponent,
};

const connector = connect(null, mapDispatchToProps);

interface DescriptionComponentProps {
  description: string;
}

const DescriptionComponent = (props: DescriptionComponentProps) => {
  const {description} = props;
  const {t} = useTranslation();
  return <>{t(description)}</>;
};

const packagedItems = [
  Source.chatPlugin,
  Source.facebook,
  Source.twilioSMS,
  Source.twilioWhatsApp,
  Source.google,
  Source.instagram,
  Source.dialogflow,
  Source.zendesk,
  Source.salesforce,
];

const findRouteForComponent = (displayName: string) => {
  switch (displayName) {
    case 'Airy Chat Plugin':
      return CONNECTORS_CHAT_PLUGIN_ROUTE;
    case 'Facebook Messenger':
      return CONNECTORS_FACEBOOK_ROUTE;
    case 'Twilio SMS':
      return CONNECTORS_TWILIO_SMS_ROUTE;
    case 'Twilio WhatsApp':
      return CONNECTORS_TWILIO_WHATSAPP_ROUTE;
    case 'Google Business Messages':
      return CONNECTORS_GOOGLE_ROUTE;
    case 'Instagram':
      return CONNECTORS_INSTAGRAM_ROUTE;
    case 'Dialogflow':
      return CONNECTORS_DIALOGFLOW_ROUTE;
    case 'Salesforce':
      return CONNECTORS_SALESFORCE_ROUTE;
    case 'Zendesk':
      return CONNECTORS_ZENDESK_ROUTE;
  }
};

const CatalogCard = (props: InfoCardProps) => {
  const {
    componentInfo,
    addChannelAction,
    style,
    enabled,
    installComponent,
    uninstallComponent,
    updateItemList,
    setIsInstalledToggled,
  } = props;
  const installed = componentInfo.installed === true;
  const [isInstalled, setIsInstalled] = useState(installed);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const {t} = useTranslation();
  const navigate = useNavigate();
  const CONNECTORS_PAGE = window.location.pathname.includes(CONNECTORS_ROUTE);
  const CATALOG_PAGE = window.location.pathname.includes(CATALOG_ROUTE);

  console.log('sourceforCompo', findSourceForComponent(componentInfo.displayName));

  useEffect(() => {
    const title = isInstalled
      ? t('uninstall') + ' ' + componentInfo.displayName
      : componentInfo.displayName + ' ' + t('installed');
    setModalTitle(title);
  }, [isInstalled]);

  const openInstallModal = () => {
    setIsInstalledToggled(true);
    setIsModalVisible(true);

    if (!isInstalled) {
      installComponent({name: componentInfo.name});
    }
  };

  const toggleInstallation = () => {
    setIsInstalled(!isInstalled);
    updateItemList(!isInstalled, componentInfo.displayName);
  };

  const cancelInstallationToggle = () => {
    setIsModalVisible(false);

    if (!isInstalled) toggleInstallation();
  };

  const confirmUninstall = () => {
    uninstallComponent({name: componentInfo.name});

    setIsModalVisible(false);
    toggleInstallation();
  };

  const handleCardClick = () => {
    const connectorRoute = findRouteForComponent(componentInfo.displayName);
    navigate(connectorRoute + '/new');
  };

  return (
    <div
      onClick={CONNECTORS_PAGE ? handleCardClick : null}
      className={`
        ${styles.infoCard} 
      `}>
      <div className={styles.channelLogoTitleContainer}>
        <div className={styles.channelLogo}>
          {getChannelAvatar(componentInfo.displayName)}

          <Button styleVariant={isInstalled ? 'green' : 'extra-small'} type="submit" onClick={openInstallModal}>
            {componentInfo.installed ? t('install').toUpperCase() : t('open').toUpperCase()}
          </Button>
        </div>
        <div className={styles.textDetails}>
          <h1>{componentInfo.displayName}</h1>

          <p> <span >Categories:</span> {componentInfo.category} </p>
        </div>
      </div>

      <div className={styles.descriptionInfo}>
        <p>
          <DescriptionComponent
            description={findSourceForComponent(componentInfo.displayName)?.replace('.', '') + 'Description'}
          />
        </p>
        <p className={styles.availability}>
          {' '}
          <div className={styles.availabilityCheckmarkIcon}>
            <CheckmarkIcon />
          </div>
          Available For:{' '}
        </p>
        {componentInfo?.availableFor &&
          componentInfo.availableFor.split(',').map((elem: string) => <button>{elem}</button>)}
      </div>

      {enabled && <ConfigStatusButton enabled={enabled} />}
      {isModalVisible && (
        <SettingsModal
          Icon={!isInstalled ? <CheckmarkIcon className={styles.checkmarkIcon}/>  : null}
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

export default connector(CatalogCard);
