import React from 'react';
import {ContentWrapper, Button, LinkButton} from 'components';
//import {ComponentInfo} from 'model';
import {useLocation} from 'react-router-dom';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {useTranslation} from 'react-i18next';
import {Link, useParams} from 'react-router-dom';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {CATALOG_ROUTE} from '../../../routes/routes';
import {availabilityFormatted, DescriptionComponent, getDescriptionSourceName} from '../CatalogCard';
import styles from './index.module.scss';

export const CatalogProductPage = () => {
  const location: any = useLocation();
  const {t} = useTranslation();
  const {
    state: {componentInfo},
  } = location;

  console.log('PRODUCT PAGE - location', location);
  console.log('PRODUCT PAGE - location.state', location?.state?.componentInfo);

  const ProductContent = () => {
    return (
      <section className={styles.componentDescription}>
        <h1>{t('Description')}</h1>
        <p>{componentInfo.description}</p>
      </section>
    );
  };


  const ProductHeader = () => {
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
          <Button className={styles.installButton} styleVariant={componentInfo?.installed ? 'warning' : 'green'}>
            {componentInfo?.installed ? t('uninstall') : t('install')}
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
            <p className={styles.bolded}>{t('Price')}:</p>
            <button key={componentInfo?.price}>{componentInfo?.price}</button>
            </section>

            <section>
            <p className={styles.bolded}>
              {t('Airy Doc Reference')}: <br/> <a href={componentInfo?.docs} target="_blank" rel="noopener noreferrer">{componentInfo?.docs}</a>
            </p>
          </section>

        </section>
      </>
    );
  };

  return (
    <ContentWrapper
      header={<ProductHeader />}
      sideColumn={<SideColumnContent />}
      transparent
      leftOffset
      content={<ProductContent />}
      variantHeight="large"
    />
  );
};
