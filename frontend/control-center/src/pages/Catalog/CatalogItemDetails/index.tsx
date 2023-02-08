import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {installComponent, listComponents, uninstallComponent} from '../../../actions/catalog';
import {StateModel} from '../../../reducers';
import {ComponentInfo, ConnectorPrice, InstallationStatus, Language, Modal, ModalType, NotificationModel} from 'model';
import {ContentWrapper, Button, LinkButton, SettingsModal, NotificationComponent, SmartButton} from 'components';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {availabilityFormatted} from '../CatalogCard';
import {DescriptionComponent, getDescriptionSourceName} from '../../../components/Description';
import {CATALOG_ROUTE} from '../../../routes/routes';
import {getNewChannelRouteForComponent} from '../../../services';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import styles from './index.module.scss';
import NotifyMeModal from '../NotifyMeModal';
import {getMergedConnectors} from '../../../selectors/connectors';

const mapStateToProps = (state: StateModel) => ({
  component: state.data.catalog,
  connectors: getMergedConnectors(state),
});

const mapDispatchToProps = {
  installComponent,
  uninstallComponent,
  listComponents,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface LocationState {
  componentInfo: ComponentInfo;
}

const CatalogItemDetails = (props: ConnectedProps<typeof connector>) => {
  const {component, connectors, installComponent, uninstallComponent, listComponents} = props;
  const location = useLocation();
  const locationState = location.state as LocationState;
  const {componentInfo} = locationState;
  const currentLanguage = localStorage.getItem('language');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotifyMeModalVisible, setIsNotifyMeModalVisible] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [notifyMeNotification, setNotifyMeNotification] = useState<NotificationModel>(null);
  const [pendingNotification, setPendingNotification] = useState<NotificationModel>(null);
  const [forceClose, setForceClose] = useState(false);
  const [installStarted, setInstallStarted] = useState(false);
  const [blockInstalling, setBlockInstalling] = useState(false);
  const notified = localStorage.getItem(`notified.${componentInfo.source}`);
  const {t} = useTranslation();
  const notifiedEmail = t('infoNotifyMe') + ` ${notified}`;
  const navigate = useNavigate();
  const NEW_COMPONENT_INSTALL_ROUTE = getNewChannelRouteForComponent(componentInfo.source);
  const isInstalled = component[componentInfo?.name]?.installationStatus === InstallationStatus.installed;

  const uninstallText = t('uninstall') + ` ${componentInfo.displayName}`;
  const installText = `${componentInfo.displayName} ` + t('installed');
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    Object.values(connectors).map(connector => {
      if (connector?.installationStatus === InstallationStatus.pending) {
        setBlockInstalling(true);
        componentInfo?.price !== ConnectorPrice.requestAccess &&
          setPendingNotification({show: true, successful: false, text: t('tooltipInstallingQueue'), info: true});
      }
    });
  }, []);

  useEffect(() => {
    installStarted && recallComponentsList(retries);
    if (connectors[componentInfo?.name]?.installationStatus === InstallationStatus.uninstalled && retries > 0) {
      setNotification({show: true, successful: true, text: t('successfullyUninstalled')});
    }
    if (connectors[componentInfo?.name]?.installationStatus === InstallationStatus.installed && retries > 0) {
      setModal({type: ModalType.install, title: installText});
      setIsModalVisible(true);
    }
  }, [connectors[componentInfo?.name]?.installationStatus, installStarted, retries, setRetries]);

  const recallComponentsList = (retries: number) => {
    const maxRetries = 15;
    setTimeout(() => {
      retries++;
      setRetries(retries);
      if (
        retries === maxRetries ||
        (connectors[componentInfo?.name]?.installationStatus !== InstallationStatus.pending && retries > 1)
      ) {
        setInstallStarted(false);
        setRetries(0);
      } else {
        listComponents();
      }
    }, 5000);
  };

  const openModalInstall = () => {
    if (!isInstalled) {
      installComponent({name: componentInfo.name})
        .then(() => {
          setInstallStarted(true);
        })
        .catch(() => {
          setNotification({show: true, successful: false, text: t('failedInstall')});
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
    setIsModalVisible(false);
    uninstallComponent({name: `${componentInfo.name}`})
      .then(() => {
        setInstallStarted(true);
      })
      .catch(() => {
        setNotification({show: true, successful: false, text: t('failedUninstall')});
      });
  };

  const handleNotifyMeClick = () => {
    setIsNotifyMeModalVisible(true);
    notified && setNotification({show: true, text: notifiedEmail, info: true});
  };

  const HeaderContent = () => {
    return (
      <section className={styles.heading}>
        <h1>{componentInfo?.displayName}</h1>
        <p>
          <DescriptionComponent source={getDescriptionSourceName(componentInfo.source)} />
        </p>
      </section>
    );
  };

  const BodyContent = () => {
    const bodyContentDescription = useRef(null);

    const parseContent = (str: string) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(str, 'text/html');
      const content = htmlDoc.body;
      const element = content.querySelector('div');
      bodyContentDescription.current.appendChild(element);
    };

    useEffect(() => {
      if (bodyContentDescription && bodyContentDescription?.current) {
        switch (currentLanguage) {
          case Language.english:
            parseContent(componentInfo.description);
            break;
          case Language.german:
            parseContent(componentInfo.descriptionDE);
            break;
          case Language.french:
            parseContent(componentInfo.descriptionFR);
            break;
          case Language.spanish:
            parseContent(componentInfo.descriptionES);
            break;
        }
      }
    }, [bodyContentDescription]);

    return (
      <section className={styles.componentDescription} ref={bodyContentDescription}>
        <h1>{t('description')}</h1>
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
          {componentInfo?.price === ConnectorPrice.requestAccess ? (
            <div className={styles.comingSoonTag}>{t('comingSoon').toUpperCase()}</div>
          ) : (
            <SmartButton
              title={
                componentInfo?.price === ConnectorPrice.requestAccess
                  ? notified
                    ? t('notifyMeRequestSent').toUpperCase()
                    : t('notifyMe').toUpperCase()
                  : isInstalled
                  ? t('uninstall')
                  : t('install')
              }
              height={50}
              width={180}
              disabled={blockInstalling}
              onClick={componentInfo?.price === ConnectorPrice.requestAccess ? handleNotifyMeClick : openModalInstall}
              pending={connectors[componentInfo?.name]?.installationStatus === InstallationStatus.pending}
              styleVariant={
                componentInfo?.price === ConnectorPrice.requestAccess
                  ? notified
                    ? 'purpleOutline'
                    : 'purple'
                  : isInstalled
                  ? 'warning'
                  : 'green'
              }
              className={styles.installButton}
            />
          )}
        </section>

        <section className={styles.details}>
          <section className={styles.detailInfo}>
            <div className={styles.availabilitySoonContainer}>
              <p className={`${styles.availability} ${styles.bolded}`}>{t('availableFor')}:</p>
              {/* 
              Commented until backend is ready!!!

              {componentInfo?.price === ConnectorPrice.requestAccess && (
                <div className={styles.soonTag}>{t('soon').toUpperCase()}</div>
              )} */}
            </div>
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
              {componentInfo?.price === ConnectorPrice.requestAccess ? (
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
              Docs: <br />{' '}
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
              <Button
                styleVariant="normal"
                type="submit"
                onClick={() => navigate(NEW_COMPONENT_INSTALL_ROUTE, {state: {from: 'catalog'}})}
              >
                {t('toConfigure')}
              </Button>
            )}
          </SettingsModal>
        )}
        {isNotifyMeModalVisible && (
          <NotifyMeModal
            setIsModalVisible={setIsNotifyMeModalVisible}
            setNotification={setNotifyMeNotification}
            setForceClose={setForceClose}
            source={componentInfo.source}
          />
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
          type={notification.info ? 'sticky' : 'fade'}
          show={notification.show}
          text={notification.text}
          successful={notification.successful}
          setShowFalse={setNotification}
          forceClose={forceClose}
          setForceClose={setForceClose}
          info={notification.info}
        />
      )}
      {pendingNotification?.show && (
        <NotificationComponent
          type="sticky"
          show={pendingNotification.show}
          text={pendingNotification.text}
          successful={pendingNotification.successful}
          setShowFalse={setPendingNotification}
          forceClose={forceClose}
          setForceClose={setForceClose}
          info={pendingNotification.info}
        />
      )}
      {notifyMeNotification?.show && (
        <NotificationComponent
          type="sticky"
          show={notifyMeNotification.show}
          text={notifyMeNotification.text}
          successful={notifyMeNotification.successful}
          setShowFalse={setNotifyMeNotification}
        />
      )}
    </>
  );
};

export default connector(CatalogItemDetails);
