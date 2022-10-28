import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services';
import {ComponentInfo, ConnectorPrice, InstallationStatus} from 'model';
import CatalogCard, {ObservationInstallStatus} from './CatalogCard';
import styles from './index.module.scss';
import {listComponents} from '../../actions';
import {CatalogSearchBar} from './CatalogSearchBar/CatalogSearchBar';
import {FilterTypes} from './CatalogSearchBar/FilterCatalogModal/FilterCatalogModal';
import {AiryLoader} from 'components/loaders/AiryLoader';
import {getMergedConnectors} from '../../selectors';

const mapStateToProps = (state: StateModel) => {
  return {
    catalogList: Object.values(state.data.catalog),
    connectors: getMergedConnectors(state),
  };
};

const mapDispatchToProps = {
  listComponents,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Catalog = (props: ConnectedProps<typeof connector>) => {
  const {catalogList, connectors} = props;
  const [orderedCatalogList, setOrderedCatalogList] = useState<ComponentInfo[]>(catalogList);
  const [observeInstallStatus, setObserveInstallStatus] = useState<ObservationInstallStatus>({status: false, name: ''});
  const isInstalling = connectors[observeInstallStatus?.name]?.installationStatus === InstallationStatus.pending;
  const {t} = useTranslation();
  const catalogPageTitle = t('Catalog');
  const [currentFilter, setCurrentFilter] = useState(
    (localStorage.getItem('catalogCurrentTypeFilter') as FilterTypes) || FilterTypes.all
  );
  const [query, setQuery] = useState('');
  const sortByName = (a: ComponentInfo, b: ComponentInfo) => a?.displayName?.localeCompare(b?.displayName);
  let numberOfTries = 0;

  useEffect(() => {
    setPageTitle(catalogPageTitle);
  }, []);

  useEffect(() => {
    retry(props.listComponents);
  }, [observeInstallStatus, numberOfTries]);

  const retry = (callback, times = 10) => {
    return new Promise(resolve => {
      const interval = setInterval(async () => {
        numberOfTries++;
        if (numberOfTries === times || !isInstalling) {
          console.log(`Trying for the last time... (${times})`);
          clearInterval(interval);
        }
        try {
          await callback();
          console.log(`Operation successful, retried ${numberOfTries} times.`);
          resolve(true);
        } catch (err) {
          console.log(`Unsuccessful, retried ${numberOfTries} times... ${err}`);
        }
      }, 5000);
    });
  };

  console.log(connectors);
  

  useLayoutEffect(() => {
    if (query && currentFilter === FilterTypes.all) {
      const filteredCatalogByName = [...catalogList].filter((component: ComponentInfo) =>
        component?.displayName?.toLowerCase().startsWith(query.toLowerCase())
      );
      setOrderedCatalogList(filteredCatalogByName);
    } else {
      const sortedByInstalled = [...catalogList]
        .filter(
          (component: ComponentInfo) =>
            component.installationStatus === InstallationStatus.installed &&
            component.price !== ConnectorPrice.requestAccess
        )
        .sort(sortByName);
      const sortedByUninstalled = [...catalogList]
        .filter(
          (component: ComponentInfo) =>
            component.installationStatus === InstallationStatus.uninstalled || component.installationStatus === undefined &&
            component.price !== ConnectorPrice.requestAccess
        )
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
        {catalogList.length > 0 && (
          <CatalogSearchBar setCurrentFilter={setCurrentFilter} currentFilter={currentFilter} setQuery={setQuery} />
        )}
      </div>
      {catalogList.length > 0 ? (
        <section className={styles.catalogListContainer}>
          {orderedCatalogList && orderedCatalogList.length > 0 ? (
            orderedCatalogList.map((infoItem: ComponentInfo) => {
              if (infoItem?.name && infoItem?.displayName) {
                return (
                  <CatalogCard
                    componentInfo={infoItem}
                    key={infoItem.displayName}
                    setObserveInstallStatus={setObserveInstallStatus}
                    isInstalling={isInstalling}
                  />
                );
              }
            })
          ) : (
            <div className={styles.notFoundContainer}>
              <h1>{t('nothingFound')}</h1>
              <span>{t('noMatchingCatalogs')}</span>
            </div>
          )}
        </section>
      ) : (
        <AiryLoader height={240} width={240} position="relative" top={220} />
      )}
    </section>
  );
};

export default connector(Catalog);
