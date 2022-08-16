import React, {useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {installComponent, uninstallComponent} from '../../../actions/catalog';
import {ContentWrapper, Button, LinkButton, SettingsModal, NotificationComponent} from 'components';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {availabilityFormatted, DescriptionComponent, getDescriptionSourceName} from '../CatalogCard';
import {CATALOG_ROUTE} from '../../../routes/routes';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {getNewChannelRouteForComponent} from '../getRouteForCard';
import {ComponentInfo, Modal, ModalType, NotificationModel} from 'model';
import styles from './index.module.scss';
import {StateModel} from '../../../reducers';

const mapStateToProps = (state: StateModel) => ({
  component: state.data.catalog,
});

const mapDispatchToProps = {
  installComponent,
  uninstallComponent,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface LocationState {
  componentInfo: ComponentInfo;
}

const CatalogItemDetails = (props: ConnectedProps<typeof connector>) => {
  const {component, installComponent, uninstallComponent} = props;
  const location = useLocation();
  const locationState = location.state as LocationState;
  const {componentInfo} = locationState;
  const isInstalled = component[componentInfo?.name]?.installed;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUninstalling, setIsUninstalling] = useState(false);
  const [notification, setNotification] = useState<NotificationModel>(null);

  const {t} = useTranslation();
  const navigate = useNavigate();
  const NEW_COMPONENT_INSTALL_ROUTE = getNewChannelRouteForComponent(componentInfo.displayName);

  const uninstallText = t('uninstall') + ` ${componentInfo.displayName}`;
  const installText = `${componentInfo.displayName} ` + t('installed');

  const openModalInstall = () => {
    if (!isInstalled) {
      setIsInstalling(true);
      installComponent({name: componentInfo.name})
        .then(() => {
          setModal({type: ModalType.install, title: installText});
          setNotification({show: true, successful: true, text: t('successfullyInstalled')});
          setIsModalVisible(true);
        })
        .catch(() => {
          setNotification({show: true, successful: false, text: t('failedInstall')});
        })
        .finally(() => {
          setIsInstalling(false);
        });
    } else {
      setModal({type: ModalType.uninstall, title: uninstallText});
      setIsModalVisible(true);
    }
  };

  const cancelInstallationToggle = () => {
    setIsModalVisible(false);
  };

  const confirmUninstall = () => {
    setIsUninstalling(true);
    setIsModalVisible(false);
    uninstallComponent({name: `${componentInfo.name}`})
      .then(() => {
        setNotification({show: true, successful: true, text: t('successfullyUninstalled')});
      })
      .catch(() => {
        setNotification({show: true, successful: false, text: t('failedUninstall')});
      })
      .finally(() => {
        setIsUninstalling(false);
      });
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
            disabled={isInstalling || isUninstalling}
            styleVariant={isInstalled ? 'warning' : 'green'}
          >
            {isInstalling
              ? t('installing')
              : isUninstalling
              ? t('uninstalling')
              : !isInstalled
              ? t('install')
              : t('uninstall')}
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
            <button key={componentInfo?.price}>
              {componentInfo?.price === 'REQUEST ACCESS' ? (
                <a href="mailto:componentsaccess@airy.co" target="_blank" rel="noreferrer">
                  {t(componentInfo?.price)}
                </a>
              ) : (
                t(componentInfo?.price)
              )}
            </button>
          </section>

          <section>
            <p className={styles.bolded}>
              Airy Docs: <br />{' '}
              <a href={componentInfo?.docs} target="_blank" rel="noopener noreferrer">
                {componentInfo?.docs}
              </a>
            </p>
          </section>
        </section>

        {isModalVisible && (
          <SettingsModal
            Icon={modal.type === ModalType.install ? <CheckmarkIcon className={styles.checkmarkIcon} /> : null}
            wrapperClassName={styles.enableModalContainerWrapper}
            containerClassName={styles.enableModalContainer}
            title={modal.title}
            close={cancelInstallationToggle}
            headerClassName={styles.headerModal}
          >
            {modal.type === ModalType.uninstall && <p> {t('uninstallComponentText')} </p>}
            {modal.type === ModalType.uninstall ? (
              <Button styleVariant="normal" type="submit" onClick={confirmUninstall}>
                {t('uninstall')}
              </Button>
            ) : (
              <Button styleVariant="normal" type="submit" onClick={() => navigate(NEW_COMPONENT_INSTALL_ROUTE)}>
                {t('toConfigure')}
              </Button>
            )}
          </SettingsModal>
        )}
      </>
    );
  };

  return (
    <>
      <ContentWrapper
        header={<HeaderContent />}
        sideColumnContent={<SideColumnContent />}
        transparent
        isSideColumn
        content={<BodyContent />}
        variantHeight="large"
      />
      {notification?.show && (
        <NotificationComponent
          show={notification.show}
          text={notification.text}
          successful={notification.successful}
          setShowFalse={setNotification}
        />
      )}
    </>
  );
};

export default connector(CatalogItemDetails);
