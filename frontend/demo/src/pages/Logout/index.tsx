import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {Redirect} from 'react-router-dom';
import {logoutUser} from '../../actions/user/index';
import {LOGIN_ROUTE} from '../../routes/routes';
import {clearUserData} from '../../api/webStore';

type LogoutConnectProps = {
    history: History;
}

const Logout = ({history}: LogoutConnectProps & RouteComponentProps) => {
  useEffect(() => {
    clearUserData();
    logoutUser();
    history.push(LOGIN_ROUTE);
  }, []);
  return <Redirect to={LOGIN_ROUTE} />;
};

const mapDispatchToProps = {logoutUser};

const connector = connect(null, mapDispatchToProps);

export default withRouter(connector(Logout));