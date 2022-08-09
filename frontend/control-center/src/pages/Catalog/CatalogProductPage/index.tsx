import React from 'react';
import {ContentWrapper, Button, LinkButton} from 'components';
//import {ComponentInfo} from 'model';
import {useLocation} from 'react-router-dom';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {useTranslation} from 'react-i18next';
import {Link, useParams} from 'react-router-dom';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {CATALOG_ROUTE} from '../../../routes/routes';
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
      <section>
        <h1>PRODUCT CONTENT</h1>
      </section>
    );
  };


  //{componentInfo?.displayName
  const ProductHeader = () => {
    return <h1></h1>;
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
        <div className={styles.detailsComponentLogo}>
          <div className={styles.logoIcon}>{getChannelAvatar(componentInfo?.displayName)}</div>
          <Button className={styles.installButton} styleVariant={componentInfo?.installed ? 'warning' : 'green'}>
            {componentInfo?.installed ? t('uninstall') : t('install')}
          </Button>
        </div>
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
