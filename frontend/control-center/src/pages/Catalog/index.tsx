import React, {useState, useEffect, useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services';
import {ComponentInfo, ConnectorPrice, InstallationStatus, NotificationModel} from 'model';
import CatalogCard, {ObservationInstallStatus} from './CatalogCard';
import styles from './index.module.scss';
import {listComponents} from '../../actions';
import {FilterTypes} from './CatalogSearchBar/FilterCatalogModal/FilterCatalogModal';
import {AiryLoader} from 'components/loaders/AiryLoader';
import {getMergedConnectors} from '../../selectors';
import {ContentWrapper, NotificationComponent} from 'components';
import {FilterBar} from 'components/general/FilterBar';
import {CatalogFilter} from './CatalogFilter';

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
  const {catalogList, connectors, listComponents} = props;
  const [orderedCatalogList, setOrderedCatalogList] = useState<ComponentInfo[]>(catalogList);
  const [observeInstallStatus, setObserveInstallStatus] = useState<ObservationInstallStatus>(null);
  const [notification, setNotification] = useState<NotificationModel>(null);
  const [showConfigureModal, setShowConfigureModal] = useState('');
  const [blockInstalling, setBlockInstalling] = useState(false);
  const {t} = useTranslation();
  const catalogPageTitle = t('Catalog');
  const [currentFilter, setCurrentFilter] = useState(
    (localStorage.getItem('catalogCurrentTypeFilter') as FilterTypes) || FilterTypes.all
  );
  const [catalogAttributeFilter, setCatalogAttributeFilter] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const sortByName = (a: ComponentInfo, b: ComponentInfo) => a?.displayName?.localeCompare(b?.displayName);

  useEffect(() => {
    setPageTitle(catalogPageTitle);
  }, []);

  useEffect(() => {
    observeInstallStatus?.pending && recallComponentsList(observeInstallStatus?.retries);

    !observeInstallStatus &&
      Object.values(connectors).map(connector => {
        connector.installationStatus === InstallationStatus.pending &&
          (setObserveInstallStatus({pending: true, name: connector.name, retries: 0}),
          recallComponentsList(observeInstallStatus?.retries));
      });
  }, [observeInstallStatus, connectors[observeInstallStatus?.name]?.installationStatus]);

  const recallComponentsList = (retries: number) => {
    connectors[observeInstallStatus?.name]?.installationStatus === InstallationStatus.pending
      ? setBlockInstalling(true)
      : setBlockInstalling(false);

    if (connectors[observeInstallStatus?.name]?.installationStatus === InstallationStatus.installed) {
      setShowConfigureModal(observeInstallStatus?.name);
    }

    if (connectors[observeInstallStatus?.name]?.installationStatus === InstallationStatus.uninstalled) {
      setNotification({show: true, successful: true, text: t('successfullyUninstalled')});
    }

    const maxRetries = 15;
    setTimeout(() => {
      retries++;
      setObserveInstallStatus({...observeInstallStatus, retries: retries});
      if (
        observeInstallStatus?.retries === maxRetries ||
        (connectors[observeInstallStatus?.name]?.installationStatus !== InstallationStatus.pending && retries > 1)
      ) {
        setObserveInstallStatus({...observeInstallStatus, pending: false});
      } else {
        listComponents();
      }
    }, 5000);
  };

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
            (component.installationStatus === InstallationStatus.uninstalled ||
              component.installationStatus === InstallationStatus.pending) &&
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

  const HeaderContent = () => {
    return (
      <section className={styles.headlineSearchBarContainer}>
        <div>
          <h1 className={styles.catalogHeadlineText}>{catalogPageTitle}</h1>
          <p className={styles.catalogDescription}>{t('catalogDescription')}</p>
        </div>
      </section>
    );
  };

  const handleQuery = (query: string) => {
    setQuery(query);
  };

  const setAttributeFilter = (option: string) => {
    if (catalogAttributeFilter.includes(option.trim())) {
      setCatalogAttributeFilter([...catalogAttributeFilter.filter(attribute => attribute.trim() != option.trim())]);
    } else {
      setCatalogAttributeFilter([...catalogAttributeFilter, option.trim()]);
    }
  };

  const filterByAttributes = (originalList: ComponentInfo[]): ComponentInfo[] => {
    return originalList.filter((item: ComponentInfo) => {
      if (!catalogAttributeFilter.length) return item;
      let fullfillsFilter = true;
      for (const attribute of catalogAttributeFilter) {
        if (
          item.category.split(', ').includes(attribute) === false &&
          item.availableFor.split(', ').includes(attribute) === false
        ) {
          fullfillsFilter = false;
          break;
        }
      }
      if (fullfillsFilter) return item;
    });
  };

  return (
    <>
      <ContentWrapper
        header={<HeaderContent />}
        transparent
        isSideColumn={false}
        content={
          <>
            <FilterBar
              currentFilter={currentFilter}
              setQuery={handleQuery}
              items={[
                {name: t('all'), setFilter: setCurrentFilter, filter: FilterTypes.all},
                {name: t('installed'), setFilter: setCurrentFilter, filter: FilterTypes.installed},
                {name: t('notInstalled'), setFilter: setCurrentFilter, filter: FilterTypes.notInstalled},
                {name: t('comingSoon'), setFilter: setCurrentFilter, filter: FilterTypes.comingSoon},
              ]}
            />
            <section className={styles.catalogWrapper}>
              <CatalogFilter catalogAttributeFilter={catalogAttributeFilter} setAttributeFilter={setAttributeFilter} />
              {filterByAttributes(catalogList).length > 0 ? (
                <section className={styles.catalogListContainer}>
                  {filterByAttributes(orderedCatalogList) && filterByAttributes(orderedCatalogList).length > 0 ? (
                    filterByAttributes(orderedCatalogList).map((infoItem: ComponentInfo) => {
                      if (infoItem?.name && infoItem?.displayName) {
                        return (
                          <CatalogCard
                            componentInfo={infoItem}
                            key={infoItem.displayName}
                            setObserveInstallStatus={setObserveInstallStatus}
                            showConfigureModal={showConfigureModal}
                            installStatus={infoItem.installationStatus}
                            blockInstalling={blockInstalling}
                            setAttributeFilter={setAttributeFilter}
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
          </>
        }
      />

      {notification?.show && (
        <NotificationComponent
          type={notification.info ? 'sticky' : 'fade'}
          show={notification.show}
          text={notification.text}
          successful={notification.successful}
          setShowFalse={setNotification}
          info={notification.info}
        />
      )}
    </>
  );
};

export default connector(Catalog);
