import React from 'react';
import _, {connect} from 'react-redux';
import TopBar from './components/TopBar';
import {Sidebar} from './components/Sidebar';
import styles from './App.module.scss';
import {getClientConfig} from './actions/config';

const mapDispatchToProps = {
  getClientConfig,
};

const connector = connect(null, mapDispatchToProps);

const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <TopBar isAdmin={true} />
        <Sidebar />
      </div>
    </div>
  );
};

export default connector(App);
