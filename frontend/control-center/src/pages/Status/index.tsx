import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {getClientConfig, getConnectorsConfiguration} from '../../actions';
import {StateModel} from '../../reducers';
import {ComponentListItem} from './ComponentListItem';
import {listComponents} from '../../actions/catalog';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import styles from './index.module.scss';
import {setPageTitle} from '../../services/pageTitle';
import {useTranslation} from 'react-i18next';

const mapDispatchToProps = {
  getClientConfig,
  getConnectorsConfiguration,
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

const Status = (props: ConnectedProps<typeof connector>) => {
  const {getClientConfig, getConnectorsConfiguration, listComponents} = props;
  const components = useSelector((state: StateModel) => Object.entries(state.data.config.components));
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const [spinAnim, setSpinAnim] = useState(true);
  const {t} = useTranslation();

  console.log('catalogList', catalogList)

  useEffect(() => {
    setPageTitle('Status');
<<<<<<< HEAD
    getClientConfig().catch((error: Error) => {
      console.error(error);
    });
    getConnectorsConfiguration().catch((error: Error) => {
      console.error(error);
    });
=======
    listComponents();
    getClientConfig();
    getConnectorsConfiguration();
>>>>>>> 73d32939 (wip)
  }, []);

  setInterval(() => {
    props.getClientConfig().catch((error: Error) => {
      console.error(error);
    });
    setSpinAnim(!spinAnim);
  }, 300000);

  const handleRefresh = () => {
    props.getClientConfig().catch((error: Error) => {
      console.error(error);
    });
    setSpinAnim(!spinAnim);
  };

  const formatToComponentName = (name: string) => {
    let formattedName;
    if(name.includes('enterprise')){
      formattedName = 'airy-enterprise/' + name;
    } else {
      formattedName = 'airy-core/' + name;
    }

    return formattedName;
  };

  return (
    <section className={styles.statusWrapper}>
      <h1>{t('status')}</h1>
      <div className={styles.listHeader}>
        <h2>{t('componentName')}</h2>
        <h2>{t('healthStatus')}</h2>

        <h2>{t('enabled')}</h2>
        <button onClick={handleRefresh} className={styles.refreshButton}>
          <div className={spinAnim ? styles.spinAnimationIn : styles.spinAnimationOut}>
            <RefreshIcon />
          </div>
        </button>
      </div>
      <div className={styles.listItems}>
        {components.map((component, index) => {
          const catalogItem = catalogList[formatToComponentName(component[0])];
          console.log('catalogItem', catalogItem);
          return (
            <ComponentListItem
              key={index}
              healthy={component[1].healthy}
              enabled={component[1].enabled}
              services={component[1].services}
              componentName={component[0]}
              source={catalogItem.source}
            />
          );
        })}
      </div>
    </section>
  );
};

export default connector(Status);
