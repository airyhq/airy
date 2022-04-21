import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {getClientConfig} from '../../actions/config';
import {StateModel} from '../../reducers';
import {ComponentListItem} from './ComponentListItem';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import styles from './index.module.scss';
import {setPageTitle} from '../../services/pageTitle';

const mapDispatchToProps = {
  getClientConfig,
};

const connector = connect(null, mapDispatchToProps);

const Status = (props: ConnectedProps<typeof connector>) => {
  const config = useSelector((state: StateModel) => state.data.config);
  const [spinAnim, setSpinAnim] = useState(true);

  useEffect(() => {
    setPageTitle('Status');
  }, []);

  useEffect(() => {
    props.getClientConfig();
  }, []);

  setInterval(() => {
    props.getClientConfig();
    setSpinAnim(!spinAnim);
  }, 300000);

  const handleRefresh = () => {
    props.getClientConfig();
    setSpinAnim(!spinAnim);
  };

  return (
    <section className={styles.statusWrapper}>
      <h1>Status</h1>
      <div className={styles.listHeader}>
        <h2>Component Name</h2>
        <h2>Health Status</h2>

        <h2>Enabled</h2>
        <button onClick={handleRefresh} className={styles.refreshButton}>
          <div className={spinAnim ? styles.spinAnimationIn : styles.spinAnimationOut}>
            <RefreshIcon />
          </div>
        </button>
      </div>
      <div className={styles.listItems}>
        {Object.entries(config.components).map(
          (component, index) =>
            component[1].enabled && (
              <ComponentListItem
                key={index}
                healthy={component[1].healthy}
                services={component[1].services}
                componentName={component[0]}
              />
            )
        )}
      </div>
    </section>
  );
};

export default connector(Status);
