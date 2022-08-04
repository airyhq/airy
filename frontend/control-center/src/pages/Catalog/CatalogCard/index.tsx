import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ComponentInfo} from 'model';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {Button, SettingsModal} from 'components';
import {installComponent} from '../../../actions/catalog';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {findSourceForComponent} from '../index';
import {getConnectedRouteForComponent, getNewChannelRouteForComponent} from './getRouteForCard';
import styles from './index.module.scss';

type CatalogCardProps = {
  componentInfo: ComponentInfo;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  installComponent,
};

const connector = connect(null, mapDispatchToProps);

const CatalogCard = (props: CatalogCardProps) => {
  const {componentInfo, installComponent} = props;
  const [isInstalled, setIsInstalled] = useState(componentInfo.installed);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {t} = useTranslation();
  const navigate = useNavigate();

  const CONFIG_CONNECTED_ROUTE = getConnectedRouteForComponent(componentInfo.displayName);
  const NEW_CHANNEL_ROUTE = getNewChannelRouteForComponent(componentInfo.displayName);

  const openInstallModal = () => {
    setIsModalVisible(true);
    installComponent({name: componentInfo.name});
  };

  const cancelInstallationToggle = () => {
    setIsModalVisible(false);
    setIsInstalled(!isInstalled);
  };

  const availabilityFormatted = (str: string) => {
    return str.includes(' - ') ? componentInfo.availableFor.split('-') : componentInfo.availableFor.split(',');
  };

  const CatalogCardButton = () => {
    if (isInstalled) {
      return (
        <Button styleVariant="extra-small" type="submit" onClick={() => navigate(CONFIG_CONNECTED_ROUTE)}>
          {t('open').toUpperCase()}
        </Button>
      );
    }

    return (
      <Button styleVariant="green" onClick={openInstallModal}>
        {t('install').toUpperCase()}
      </Button>
    );
  };

  const DescriptionComponent = (props: {description: string}) => {
    const {description} = props;
    const {t} = useTranslation();
    return <>{t(description)}</>;
  };

  return (
    <article className={styles.catalogCard}>
      <section className={styles.cardLogoTitleContainer}>
        <div className={styles.componentLogo}>
          {getChannelAvatar(componentInfo.displayName)}
          <CatalogCardButton />
        </div>
        <div className={styles.componentInfo}>
          <h1>{componentInfo.displayName}</h1>

          <p>
            {' '}
            <span className={styles.bolded}>{t('categories')}</span> {componentInfo.category}{' '}
          </p>
        </div>
      </section>

      <div className={styles.descriptionInfo}>
        <p>
          <DescriptionComponent
            description={findSourceForComponent(componentInfo.displayName)?.replace('.', '') + 'Description'}
          />
        </p>
        <p className={`${styles.availability} ${styles.bolded}`}>
          <CheckmarkIcon className={styles.availabilityCheckmarkIcon} />
          {t('availableFor')}:
        </p>
        {componentInfo?.availableFor &&
          availabilityFormatted(componentInfo.availableFor).map((service: string) => (
            <button key={service}>{service}</button>
          ))}
      </div>

      {isModalVisible && (
        <SettingsModal
          Icon={<CheckmarkIcon className={styles.checkmarkIcon} />}
          wrapperClassName={styles.enableModalContainerWrapper}
          containerClassName={styles.enableModalContainer}
          title={`${componentInfo.displayName} ${t('installed')}`}
          close={cancelInstallationToggle}
          headerClassName={styles.headerModal}
        >
          <Button styleVariant="normal" type="submit" onClick={() => navigate(NEW_CHANNEL_ROUTE)}>
            {t('toConfigure')}
          </Button>
        </SettingsModal>
      )}
    </article>
  );
};

export default connector(CatalogCard);
