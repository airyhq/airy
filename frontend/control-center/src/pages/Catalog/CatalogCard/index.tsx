import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import {installComponent} from '../../../actions/catalog';
import {ComponentInfo, ConnectorPrice, InstallationStatus, NotificationModel} from 'model';
import {Button, NotificationComponent, SettingsModal, Tooltip} from 'components';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {
  getCatalogProductRouteForComponent,
  getConnectedRouteForComponent,
  getNewChannelRouteForComponent,
} from '../../../services';
import {DescriptionComponent, getDescriptionSourceName} from '../../../components/Description';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import styles from './index.module.scss';
import NotifyMeModal from '../NotifyMeModal';
import {getMergedConnectors} from '../../../selectors';
import {InstallerLoader} from 'components/loaders/InstallerLoader';

export type ObservationInstallStatus = {
  pending: boolean;
  name: string;
  retries: number;
};

type CatalogCardProps = {
  componentInfo: ComponentInfo;
  setObserveInstallStatus: Dispatch<SetStateAction<ObservationInstallStatus>>;
  showConfigureModal: string;
  blockInstalling: boolean;
  installStatus: InstallationStatus;
  setAttributeFilter: Dispatch<SetStateAction<string>>;
} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  connectors: getMergedConnectors(state),
});

const mapDispatchToProps = {
  installComponent,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const availabilityFormatted = (availability: string) => availability.split(',');

const CatalogCard = (props: CatalogCardProps) => {
  const {
    connectors,
    componentInfo,
    installComponent,
    setObserveInstallStatus,
    setAttributeFilter,
    showConfigureModal,
    blockInstalling,
    installStatus,
  } = props;
  const hasConnectedChannels = connectors[componentInfo?.name].connectedChannels > 0;
  const isConfigured = connectors[componentInfo?.name].isConfigured;
  const isChannel = connectors[componentInfo?.name].isChannel;
  const [isPending, setIsPending] = useState(installStatus === InstallationStatus.pending);
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
  const navigateConfigure = getNewChannelRouteForComponent(componentInfo?.source);

  //Commented until backend is ready for this!!!
  // const notifiedEmail = t('infoNotifyMe') + ` ${notified}`;

  useEffect(() => {
    showConfigureModal === componentInfo?.name && (setIsModalVisible(true), setIsPending(false));
    if (connectors[componentInfo?.name].installationStatus !== InstallationStatus.pending) {
      setIsPending(false);
    }
  }, [showConfigureModal, connectors[componentInfo?.name].installationStatus]);

  const openInstallModal = () => {
    setIsPending(true);
    installComponent({name: componentInfo.name})
      .then(() => {
        setObserveInstallStatus({pending: true, name: componentInfo?.name, retries: 0});
      })
      .catch(() => {
        setNotification({show: true, successful: false, text: t('failedInstall')});
        setObserveInstallStatus({pending: false, name: componentInfo?.name, retries: 0});
        setIsPending(false);
      });
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

    if (connectors[componentInfo?.name].installationStatus === InstallationStatus.installed) {
      return (
        <Button
          styleVariant="extra-small"
          type="submit"
          onClick={() =>
            navigate(
              getConnectedRouteForComponent(
                componentInfo?.source,
                isChannel,
                componentInfo.isApp,
                hasConnectedChannels,
                isConfigured
              )
            )
          }
          buttonRef={installButtonCard}
        >
          {t('openCatalog').toUpperCase()}
        </Button>
      );
    }

    return (
      <>
        {blockInstalling ? (
          <Tooltip
            hoverElement={
              <Button
                className={styles.smartButton}
                styleVariant="green"
                type="submit"
                onClick={openInstallModal}
                disabled={blockInstalling || isPending}
                buttonRef={installButtonCard}
              >
                {installStatus === InstallationStatus.pending || isPending
                  ? t('pending').toUpperCase()
                  : t('install').toUpperCase()}
              </Button>
            }
            hoverElementWidth={400}
            direction="right"
            position="absolute"
            top={84}
            left={100}
            tooltipContent={t('tooltipInstallingQueue')}
          />
        ) : (
          <Button
            className={styles.smartButton}
            styleVariant="green"
            type="submit"
            onClick={openInstallModal}
            disabled={blockInstalling || isPending}
            buttonRef={installButtonCard}
          >
            {installStatus === InstallationStatus.pending || isPending
              ? t('pending').toUpperCase()
              : t('install').toUpperCase()}
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      <div className={styles.installerLoaderWrapper}>
        <InstallerLoader
          installing={installStatus === InstallationStatus.pending || isPending}
          borderRadius={10}
          marginRight={28}
          marginBottom={28}
        >
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
                  <span className={styles.bolded}>{t('categories')}: </span>
                  <div className={styles.category}>
                    {componentInfo.category.split(', ').map((key: string, index: number) => {
                      let attribute = key;
                      if (componentInfo.category.split(', ').length - 1 !== index) {
                        attribute = ' ' + attribute + ',';
                      }
                      return (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setAttributeFilter(key);
                          }}
                        >
                          {attribute}
                        </button>
                      );
                    })}
                  </div>
                </p>
              </div>
            </section>
            <div className={styles.descriptionInfo}>
              {componentInfo.name && (
                <p className={styles.description}>
                  <DescriptionComponent source={getDescriptionSourceName(componentInfo.source)} />
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
                      <button
                        key={service}
                        onClick={e => {
                          e.stopPropagation();
                          setAttributeFilter(service);
                        }}
                      >
                        {service}
                      </button>
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
      </div>

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
