import React, {useState, useEffect} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {installComponent, uninstallComponent} from '../../../actions/catalog';
import {ContentWrapper, Button, LinkButton, SettingsModal} from 'components';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {availabilityFormatted, DescriptionComponent, getDescriptionSourceName} from '../CatalogCard';
import {CATALOG_ROUTE} from '../../../routes/routes';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {getNewChannelRouteForComponent} from '../getRouteForCard';
import {ComponentInfo} from 'model';
import styles from './index.module.scss';

const mapDispatchToProps = {
  installComponent,
  uninstallComponent,
};

const connector = connect(null, mapDispatchToProps);

interface LocationState {
  componentInfo: ComponentInfo;
}

const CatalogItemDetails = (props: ConnectedProps<typeof connector>) => {
  const {installComponent, uninstallComponent} = props;
  const location = useLocation();
  const locationState = location.state as LocationState;
  const {componentInfo} = locationState;
  const [isInstalled, setIsInstalled] = useState(componentInfo.installed);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const {t} = useTranslation();
  const navigate = useNavigate();
  const NEW_COMPONENT_INSTALL_ROUTE = getNewChannelRouteForComponent(componentInfo.displayName);

  const uninstallText = t('uninstall') + ` ${componentInfo.displayName}`;
  const installText = `${componentInfo.displayName} ` + t('installed');

  useEffect(() => {
    const title = isInstalled ? uninstallText : installText;
    setModalTitle(title);
  }, [isInstalled]);

  const openModalInstall = () => {
    setIsModalVisible(true);

    if (!isInstalled) installComponent({name: `${componentInfo.name}`});
  };

  const toggleButtonInstallationStatus = () => {
    setIsInstalled(!isInstalled);
  };

  const cancelInstallationToggle = () => {
    setIsModalVisible(false);

    if (!isInstalled) toggleButtonInstallationStatus();
  };

  const confirmUninstall = () => {
    uninstallComponent({name: `${componentInfo.name}`});

    setIsModalVisible(false);
    toggleButtonInstallationStatus();
  };

  const HeaderContent = () => {
    return (
      <section className={styles.heading}>
        <h1>{componentInfo?.displayName}</h1>
        <p>
          <DescriptionComponent
            description={getDescriptionSourceName(componentInfo.name, componentInfo.displayName) + 'Description'}
          />
        </p>
      </section>
    );
  };

  const BodyContent = () => {
    return (
      <section className={styles.componentDescription}>
        <h1>{t('Description')}</h1>
        <p>{componentInfo.description}</p>
      </section>
    );
  };

  const SideColumnContent = () => {
    return (
      <>
        <Link className={styles.backButton} to={CATALOG_ROUTE}>
          <LinkButton type="button">
            <div className={styles.linkButtonContainer}>
              <ArrowLeftIcon className={styles.backIcon} />
              {t('Catalog')}
            </div>
          </LinkButton>
        </Link>

        <section className={styles.detailsComponentLogo}>
          <div className={styles.logoIcon}>{getChannelAvatar(componentInfo?.displayName)}</div>
          <Button
            onClick={openModalInstall}
            className={styles.installButton}
            styleVariant={isInstalled ? 'warning' : 'green'}
          >
            {isInstalled ? t('uninstall') : t('install')}
          </Button>
        </section>

        <section className={styles.details}>
          <section className={styles.detailInfo}>
            <p className={`${styles.availability} ${styles.bolded}`}>{t('availableFor')}:</p>
            {componentInfo?.availableFor &&
              availabilityFormatted(componentInfo.availableFor).map((service: string) => (
                <button key={service}>{service}</button>
              ))}
          </section>

          <section className={styles.detailInfo}>
            <p className={styles.bolded}>{t('categories')}:</p>
            {componentInfo?.category &&
              availabilityFormatted(componentInfo?.category).map((categoryItem: string) => (
                <button key={categoryItem}>{categoryItem}</button>
              ))}
          </section>

          <section className={styles.detailInfo}>
            <p className={styles.bolded}>{t('price')}:</p>
            <button key={componentInfo?.price}>{t(componentInfo?.price)}</button>
          </section>

          <section>
            <p className={styles.bolded}>
              {t('Airy Doc Reference')}: <br />{' '}
              <a href={componentInfo?.docs} target="_blank" rel="noopener noreferrer">
                {componentInfo?.docs}
              </a>
            </p>
          </section>
        </section>

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
              <Button styleVariant="normal" type="submit" onClick={() => navigate(NEW_COMPONENT_INSTALL_ROUTE)}>
                {t('toConfigure')}
              </Button>
            ) : (
              <Button styleVariant="normal" type="submit" onClick={confirmUninstall}>
                {t('uninstall')}
              </Button>
            )}
          </SettingsModal>
        )}
      </>
    );
  };

  return (
    <ContentWrapper
      header={<HeaderContent />}
      sideColumnContent={<SideColumnContent />}
      transparent
      isSideColumn
      content={<BodyContent />}
      variantHeight="large"
    />
  );
};

export default connector(CatalogItemDetails);
