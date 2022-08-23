import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ComponentInfo, getSourceForComponent, NotificationModel} from 'model';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {Button, NotificationComponent, SettingsModal, SmartButton} from 'components';
import {installComponent} from '../../../actions/catalog';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {
  getConnectedRouteForComponent,
  getNewChannelRouteForComponent,
  getCatalogProductRouteForComponent,
} from '../getRouteForCard';
import styles from './index.module.scss';
import {StateModel} from '../../../reducers';

type CatalogCardProps = {
  componentInfo: ComponentInfo;
} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  component: state.data.catalog,
});

const mapDispatchToProps = {
  installComponent,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const availabilityFormatted = (availability: string) => availability.split(',');

export const DescriptionComponent = (props: {description: string}) => {
  const {description} = props;
  const {t} = useTranslation();
  return <>{t(description)}</>;
};

export const getDescriptionSourceName = (name: string, displayName: string) => {
  if (displayName.includes('SMS')) return 'twiliosms';
  if (displayName.includes('WhatsApp')) return 'twilioWhatsapp';
  return getSourceForComponent(name)?.replace('.', '');
};

const CatalogCard = (props: CatalogCardProps) => {
  const {component, componentInfo, installComponent} = props;
  const isInstalled = component[componentInfo?.name]?.installed;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const installButtonCard = useRef(null);
  const componentCard = useRef(null);
  const {t} = useTranslation();
  const navigate = useNavigate();

  const CONFIG_CONNECTED_ROUTE = getConnectedRouteForComponent(componentInfo.displayName);
  const NEW_CHANNEL_ROUTE = getNewChannelRouteForComponent(componentInfo.displayName);

  const openInstallModal = () => {
    setIsPending(true);
    installComponent({name: componentInfo.name})
      .then(() => {
        setNotification({show: true, successful: true, text: t('successfullyInstalled')});
        setIsModalVisible(true);
      })
      .catch(() => {
        setNotification({show: true, successful: false, text: t('failedInstall')});
      })
      .finally(() => {
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
      navigate(getCatalogProductRouteForComponent(componentInfo.displayName), {state: {componentInfo}});
    }
  };

  const CatalogCardButton = () => {
    if (isInstalled) {
      return (
        <Button
          styleVariant="extra-small"
          type="submit"
          onClick={() => navigate(CONFIG_CONNECTED_ROUTE)}
          buttonRef={installButtonCard}
        >
          {t('open').toUpperCase()}
        </Button>
      );
    }

    return (
      <SmartButton
        height={24}
        width={80}
        className={styles.smartButton}
        styleVariant="green"
        type="submit"
        title={t('install').toUpperCase()}
        onClick={openInstallModal}
        pending={isPending}
        disabled={isPending}
        buttonRef={installButtonCard}
        // style={{minWidth: '80px', height: '24px'}}
      />
    );
  };

  return (
    <>
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
              <DescriptionComponent
                description={getDescriptionSourceName(componentInfo.name, componentInfo.displayName) + 'Description'}
              />
            </p>
          )}

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
            close={closeModal}
            headerClassName={styles.headerModal}
          >
            <Button styleVariant="normal" type="submit" onClick={() => navigate(NEW_CHANNEL_ROUTE)}>
              {t('toConfigure')}
            </Button>
          </SettingsModal>
        )}
      </article>
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

export default connector(CatalogCard);
