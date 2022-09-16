import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {listComponents} from '../../actions/catalog';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services';
import {ComponentInfo, ConnectorPrice} from 'model';
import CatalogCard from './CatalogCard';
import styles from './index.module.scss';

const mapStateToProps = (state: StateModel) => {
  return {
    catalogList: Object.values(state.data.catalog),
  };
};

const mapDispatchToProps = {
  listComponents,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Catalog = (props: ConnectedProps<typeof connector>) => {
  const {catalogList, listComponents} = props;
  const [orderedCatalogList, setOrderedCatalogList] = useState<ComponentInfo[]>(catalogList);
  const {t} = useTranslation();
  const catalogPageTitle = t('Catalog');
  const sortByName = (a: ComponentInfo, b: ComponentInfo) => a?.displayName?.localeCompare(b?.displayName);

  useEffect(() => {
    listComponents().catch((error: Error) => {
      console.error(error);
    });
    setPageTitle(catalogPageTitle);
  }, []);

  useLayoutEffect(() => {
    const sortedByInstalled = [...catalogList]
      .filter((component: ComponentInfo) => component.installed && component.price !== ConnectorPrice.requestAccess)
      .sort(sortByName);
    const sortedByUninstalled = [...catalogList]
      .filter((component: ComponentInfo) => !component.installed && component.price !== ConnectorPrice.requestAccess)
      .sort(sortByName);
    const sortedByAccess = [...catalogList]
      .filter((component: ComponentInfo) => component.price === ConnectorPrice.requestAccess)
      .sort(sortByName);

    setOrderedCatalogList(sortedByInstalled.concat(sortedByUninstalled).concat(sortedByAccess));
  }, [catalogList]);

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
