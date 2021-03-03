import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import {listTemplates} from '../../../actions/templates';

const mapDispatchToProps = {
  listTemplates,
};

const connector = connect(null, mapDispatchToProps);

const TemplateSelector = ({listTemplates}) => {
  useEffect(() => {
    listTemplates({});
  }, []);

  return <div className={styles.component}> </div>;
};

export default connector(TemplateSelector);
