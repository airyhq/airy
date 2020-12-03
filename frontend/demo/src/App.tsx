import React, {Component} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, Route, Switch, Redirect, RouteComponentProps} from 'react-router-dom';

import {AiryLoader} from '@airyhq/components';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';

import {StateModel} from './reducers';
import {CHANNELS_ROUTE, LOGIN_ROUTE, ROOT_ROUTE} from './routes/routes';

import styles from './App.module.scss';
import Channels from './pages/Channels';

const publicRoutes = [LOGIN_ROUTE];

const shouldRedirect = (path: string) =>
  publicRoutes.filter((route: string) => path.indexOf(route) !== -1).length === 0;

class App extends Component<ConnectedProps<typeof connector> & RouteComponentProps> {
  constructor(props: ConnectedProps<typeof connector> & RouteComponentProps) {
    super(props);
  }

  get isAuthSuccess() {
    return this.props.user.token && this.props.user.token !== '';
  }

  shouldShowSidebar = (path: string) => {
    return this.isAuthSuccess;
  };

  render() {
    if (!this.props.user.id) {
      if (this.props.token) {
        return <Route path="*" component={AiryLoader} />;
      } else if (shouldRedirect(this.props.location.pathname)) {
        return <Redirect to={LOGIN_ROUTE} />;
      }
    }

    return (
      <div className={styles.Container}>
        <div className={`${this.isAuthSuccess ? styles.ContainerApp : styles.ContainerAppNotLogin}`}>
          {this.shouldShowSidebar(this.props.location.pathname) ? (
            <>
              <TopBar isAdmin={true} />
              <Sidebar />
            </>
          ) : (
            <div />
          )}
          <Switch>
            <Route exact path={ROOT_ROUTE}>
              {this.isAuthSuccess ? <Redirect to={ROOT_ROUTE} /> : <Redirect to={LOGIN_ROUTE} />}
            </Route>
            <Route exact path={LOGIN_ROUTE} component={Login} />
            <Route exact path={CHANNELS_ROUTE} component={Channels} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StateModel, ownProps: RouteComponentProps) => {
  return {
    user: state.data.user,
    pathname: ownProps.location.pathname,
    token: state.data.user.token,
  };
};

const connector = connect(mapStateToProps, null);

export default withRouter(connector(App));
