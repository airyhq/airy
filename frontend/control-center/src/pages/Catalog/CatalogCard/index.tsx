import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import {installComponent} from '../../../actions/catalog';
import {ComponentInfo, ConnectorPrice, InstallationStatus, NotificationModel} from 'model';
import {Button, NotificationComponent, SettingsModal} from 'components';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {getCatalogProductRouteForComponent, getConnectedRouteForComponent} from '../../../services';
import {DescriptionComponent, getDescriptionSourceName} from '../../../components/Description';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import styles from './index.module.scss';
import NotifyMeModal from '../NotifyMeModal';
import {CONNECTORS_ROUTE} from '../../../routes/routes';
import {getMergedConnectors} from '../../../selectors';
import {InstallerLoader} from 'components/loaders/InstallerLoader';

export type ObservationInstallStatus = {
  status: boolean;
  name: string;
};

type CatalogCardProps = {
  componentInfo: ComponentInfo;
  setObserveInstallStatus: Dispatch<SetStateAction<ObservationInstallStatus>>;
  isInstalling: boolean;
} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  component: state.data.catalog,
  connectors: getMergedConnectors(state),
});

const mapDispatchToProps = {
  installComponent,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const availabilityFormatted = (availability: string) => availability.split(',');

const CatalogCard = (props: CatalogCardProps) => {
  const {component, connectors, componentInfo, installComponent, setObserveInstallStatus} = props;
  const hasConnectedChannels = connectors[componentInfo?.name].connectedChannels > 0;
  const isConfigured = connectors[componentInfo?.name].isConfigured;
  const isChannel = connectors[componentInfo?.name].isChannel;
  const isInstalled = component[componentInfo?.name]?.installationStatus === InstallationStatus.installed;
  const [isInstalling, setIsInstalling] = useState(props.isInstalling);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotifyMeModalVisible, setIsNotifyMeModalVisible] = useState(false);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [notifyMeNotification, setNotifyMeNotification] = useState<NotificationModel>(null);
  const [forceClose, setForceClose] = useState(false);
  //Commented until backend is ready for this!!!
  // const notified = localStorage.getItem(`notified.${componentInfo.source}`);
  const installButtonCard = useRef(null);
  const componentCard = useRef(null);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const navigateConfigure = `${CONNECTORS_ROUTE}/${componentInfo?.source}/configure`;

  //Commented until backend is ready for this!!!
  // const notifiedEmail = t('infoNotifyMe') + ` ${notified}`;

  const openInstallModal = () => {
    setIsInstalling(true);
    installComponent({name: componentInfo.name})
      .then(() => {
        setNotification({show: true, successful: true, text: t('successfullyInstalled')});
        setIsModalVisible(true);
        setObserveInstallStatus({status: true, name: componentInfo?.name});
      })
      .catch(() => {
        setNotification({show: true, successful: false, text: t('failedInstall')});
      });
    // .finally(() => {
    //   setIsPending(false);
    // });
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    const isClickOnInstallButton = installButtonCard?.current.contains(e.target);
    const isClickOnCard = componentCard?.current.contains(e.target);

    if (!isClickOnInstallButton && isClickOnCard) {
      navigate(getCatalogProductRouteForComponent(componentInfo.source), {state: {componentInfo}});
    }
  };

  //Commented until backend is ready for this!!!
  // const handleNotifyMeClick = () => {
  //   setIsNotifyMeModalVisible(true);
  //   notified && setNotification({show: true, text: notifiedEmail, info: true});
  // };

  const CatalogCardButton = () => {
    //Commented until backend is ready for this!!!

    // if (componentInfo?.price === ConnectorPrice.requestAccess) {
    //   return (
    //     <Button
    //       styleVariant={notified ? 'purpleOutline' : 'purple'}
    //       type="submit"
    //       onClick={handleNotifyMeClick}
    //       buttonRef={installButtonCard}
    //       className={styles.notifyMeButton}>
    //       {notified ? t('notifyMeRequestSent').toUpperCase() : t('notifyMe').toUpperCase()}
    //     </Button>
    //   );
    // }

    if (componentInfo?.price === ConnectorPrice.requestAccess) {
      return (
        <Button
          className={styles.comingSoonTag}
          onClick={() => navigate(getCatalogProductRouteForComponent(componentInfo.source), {state: {componentInfo}})}
          buttonRef={installButtonCard}
        >
          {t('comingSoon').toUpperCase()}
        </Button>
      );
    }

    if (isInstalled) {
      return (
        <Button
          styleVariant="extra-small"
          type="submit"
          onClick={() =>
            navigate(
              getConnectedRouteForComponent(componentInfo?.source, isChannel, hasConnectedChannels, isConfigured)
            )
          }
          buttonRef={installButtonCard}
        >
          {t('openCatalog').toUpperCase()}
        </Button>
      );
    }

    return (
      <Button
        className={styles.smartButton}
        styleVariant="green"
        type="submit"
        onClick={openInstallModal}
        disabled={isInstalling}
        buttonRef={installButtonCard}
      >
        {isInstalling ? t('pending').toUpperCase() : t('install').toUpperCase()}
      </Button>
      // <SmartButton
      //   height={24}
      //   width={installButtonCard?.current?.offsetWidth}
      //   className={styles.smartButton}
      //   styleVariant="green"
      //   type="submit"
      //   title={isInstalling ? t('pending').toUpperCase() : t('install').toUpperCase()}
      //   onClick={openInstallModal}
      //   pending={isInstalling}
      //   disabled={isPending}
      //   buttonRef={installButtonCard}
      // />
    );
  };

  return (
    <>
      <InstallerLoader installing={isInstalling} borderRadius={10} marginRight={28} marginBottom={36}>
        <article className={styles.catalogCard} onClick={handleCardClick} ref={componentCard}>
          <section className={styles.cardLogoTitleContainer}>
            <div className={styles.componentLogo}>
              {getChannelAvatar(componentInfo.displayName)}
              <CatalogCardButton />
            </div>
            <div className={styles.componentInfo}>
              <h1>{componentInfo.displayName}</h1>
              <p>
                {' '}
                <span className={styles.bolded}>{t('categories')}:</span> {componentInfo.category}{' '}
              </p>
            </div>
          </section>

          <div className={styles.descriptionInfo}>
            {componentInfo.name && (
              <p>
                <DescriptionComponent description={getDescriptionSourceName(componentInfo.source) + 'Description'} />
              </p>
            )}

            <p className={`${styles.availability} ${styles.bolded}`}>
              <CheckmarkIcon className={styles.availabilityCheckmarkIcon} />
              {t('availableFor')}:
            </p>
            <div className={styles.availableForSoonContainer}>
              <div>
                {componentInfo?.availableFor &&
                  availabilityFormatted(componentInfo.availableFor).map((service: string) => (
                    <button key={service}>{service}</button>
                  ))}
              </div>
              {/* Commented until backend is ready for this!!!

             {componentInfo?.price === ConnectorPrice.requestAccess && (
              <div className={styles.soonTag}>{t('soon').toUpperCase()}</div>
            )} */}
            </div>
          </div>

          {isModalVisible && (
            <SettingsModal
              Icon={<CheckmarkIcon className={styles.checkmarkIcon} />}
              wrapperClassName={styles.enableModalContainerWrapper}
              containerClassName={styles.enableModalContainer}
              title={`${componentInfo.displayName} ${t('installed')}`}
              close={closeModal}
              headerClassName={styles.headerModal}
            >
              <Button
                styleVariant="normal"
                type="submit"
                onClick={() => navigate(navigateConfigure, {state: {from: 'catalog'}})}
              >
                {t('toConfigure')}
              </Button>
            </SettingsModal>
          )}

          {isNotifyMeModalVisible && (
            <NotifyMeModal
              source={componentInfo.source}
              setIsModalVisible={setIsNotifyMeModalVisible}
              setNotification={setNotifyMeNotification}
              setForceClose={setForceClose}
            />
          )}
        </article>
      </InstallerLoader>

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

export default connector(CatalogCard);
