import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {listComponents} from '../../actions/catalog';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services';
import {ComponentInfo} from 'model';
import CatalogCard from './CatalogCard';
import styles from './index.module.scss';

const mapDispatchToProps = {
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

const Catalog = (props: ConnectedProps<typeof connector>) => {
  const {listComponents} = props;
  const [orderedCatalogList, setOrderedCatalogList] = useState([]);
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const {t} = useTranslation();
  const catalogPageTitle = t('Catalog');

  useEffect(() => {
    listComponents();
    setPageTitle(catalogPageTitle);
  }, []);

  useEffect(() => {
    setOrderedCatalogList(Object.values(catalogList).sort(sortByInstall));
  }, [catalogList]);

  const sortByInstall = (a: ComponentInfo) => {
    if (a.installed) return 1;
    return -1;
  };

  return (
    <section className={styles.catalogWrapper}>
      <h1 className={styles.catalogHeadlineText}>{catalogPageTitle}</h1>

      <section className={styles.catalogListContainer}>
        {orderedCatalogList &&
          orderedCatalogList.map((infoItem: ComponentInfo) => {
            if (infoItem?.name && infoItem?.displayName) {
              return <CatalogCard componentInfo={infoItem} key={infoItem.displayName} />;
            }
          })}
      </section>
    </section>
  );
};

export default connector(Catalog);
