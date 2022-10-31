import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services';
import {ComponentInfo, ConnectorPrice} from 'model';
import CatalogCard from './CatalogCard';
import styles from './index.module.scss';
import {listComponents, getConnectorsConfiguration, listChannels} from '../../actions';
import {CatalogSearchBar} from './CatalogSearchBar/CatalogSearchBar';
import {FilterTypes} from './CatalogSearchBar/FilterCatalogModal/FilterCatalogModal';

const mapStateToProps = (state: StateModel) => {
  return {
    catalogList: Object.values(state.data.catalog),
  };
};

const mapDispatchToProps = {
  listComponents,
  getConnectorsConfiguration,
  listChannels,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Catalog = (props: ConnectedProps<typeof connector>) => {
  const {catalogList, listComponents, getConnectorsConfiguration, listChannels} = props;
  const [orderedCatalogList, setOrderedCatalogList] = useState<ComponentInfo[]>(catalogList);
  const {t} = useTranslation();
  const catalogPageTitle = t('Catalog');
  const [currentFilter, setCurrentFilter] = useState(
    (localStorage.getItem('catalogCurrentTypeFilter') as FilterTypes) || FilterTypes.all
  );
  const [query, setQuery] = useState('');
  const sortByName = (a: ComponentInfo, b: ComponentInfo) => a?.displayName?.localeCompare(b?.displayName);

  useEffect(() => {
    listChannels().catch((error: Error) => {
      console.error(error);
    });
    getConnectorsConfiguration().catch((error: Error) => {
      console.error(error);
    });
    listComponents().catch((error: Error) => {
      console.error(error);
    });
    setPageTitle(catalogPageTitle);
  }, []);

  useLayoutEffect(() => {
    if (query && currentFilter === FilterTypes.all) {
      const filteredCatalogByName = [...catalogList].filter((component: ComponentInfo) =>
        component?.displayName?.toLowerCase().startsWith(query.toLowerCase())
      );
      setOrderedCatalogList(filteredCatalogByName);
    } else {
      const sortedByInstalled = [...catalogList]
        .filter((component: ComponentInfo) => component.installed && component.price !== ConnectorPrice.requestAccess)
        .sort(sortByName);
      const sortedByUninstalled = [...catalogList]
        .filter((component: ComponentInfo) => !component.installed && component.price !== ConnectorPrice.requestAccess)
        .sort(sortByName);
      const sortedByAccess = [...catalogList]
        .filter((component: ComponentInfo) => component.price === ConnectorPrice.requestAccess)
        .sort(sortByName);

      switch (currentFilter) {
        case FilterTypes.all:
          setOrderedCatalogList(sortedByInstalled.concat(sortedByUninstalled).concat(sortedByAccess));
          break;
        case FilterTypes.installed:
          query !== ''
            ? setOrderedCatalogList(
                sortedByInstalled.filter((component: ComponentInfo) =>
                  component?.displayName?.toLowerCase().startsWith(query.toLowerCase())
                )
              )
            : setOrderedCatalogList(sortedByInstalled);
          break;
        case FilterTypes.comingSoon:
          query !== ''
            ? setOrderedCatalogList(
                sortedByAccess.filter((component: ComponentInfo) =>
                  component?.displayName?.toLowerCase().startsWith(query.toLowerCase())
                )
              )
            : setOrderedCatalogList(sortedByAccess);
          break;
        case FilterTypes.notInstalled:
          query !== ''
            ? setOrderedCatalogList(
                sortedByUninstalled.filter((component: ComponentInfo) =>
                  component?.displayName?.toLowerCase().startsWith(query.toLowerCase())
                )
              )
            : setOrderedCatalogList(sortedByUninstalled);
          break;
      }
    }
  }, [catalogList, currentFilter, query]);

  return (
    <section className={styles.catalogWrapper}>
      <div className={styles.headlineSearchBarContainer}>
        <h1 className={styles.catalogHeadlineText}>{catalogPageTitle}</h1>
        <CatalogSearchBar setCurrentFilter={setCurrentFilter} currentFilter={currentFilter} setQuery={setQuery} />
      </div>

      <section className={styles.catalogListContainer}>
        {orderedCatalogList && orderedCatalogList.length > 0 ? (
          orderedCatalogList.map((infoItem: ComponentInfo) => {
            if (infoItem?.name && infoItem?.displayName) {
              return <CatalogCard componentInfo={infoItem} key={infoItem.displayName} />;
            }
          })
        ) : (
          <div className={styles.notFoundContainer}>
            <h1>{t('nothingFound')}</h1>
            <span>{t('noMatchingCatalogs')}</span>
          </div>
        )}
      </section>
    </section>
  );
};

export default connector(Catalog);
