import React, {Component} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, Route, Switch, Redirect, RouteComponentProps} from 'react-router-dom';

import {AiryLoader} from '@airyhq/components';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import Channels from './pages/Channels';
import Inbox from './pages/Inbox';
import Tags from './pages/Tags';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';
import AiryWebSocket from './components/AiryWebsocket';
import {fakeSettingsAPICall} from './actions/settings';
import {StateModel} from './reducers';

import {INBOX_ROUTE, CHANNELS_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE, ROOT_ROUTE, TAGS_ROUTE} from './routes/routes';

import styles from './App.module.scss';

const mapStateToProps = (state: StateModel, ownProps: RouteComponentProps) => {
  return {
    user: state.data.user,
    pathname: ownProps.location.pathname,
    token: state.data.user.token,
  };
};

const mapDispatchToProps = {
  fakeSettingsAPICall,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const publicRoutes = [LOGIN_ROUTE];

const shouldRedirect = (path: string) =>
  publicRoutes.filter((route: string) => path.indexOf(route) !== -1).length === 0;

class App extends Component<ConnectedProps<typeof connector> & RouteComponentProps> {
  constructor(props: ConnectedProps<typeof connector> & RouteComponentProps) {
    super(props);
  }

  componentDidMount() {
    this.props.fakeSettingsAPICall();
  }

  get isAuthSuccess() {
    return this.props.user.token && this.props.user.token !== '';
  }

  shouldShowSidebar = () => {
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
      <AiryWebSocket>
        <div className={styles.Container}>
          <div className={`${this.isAuthSuccess ? styles.ContainerApp : styles.ContainerAppNotLogin}`}>
            {this.shouldShowSidebar() ? (
              <>
                <TopBar isAdmin={true} />
                <Sidebar />
              </>
            ) : (
              <div />
            )}
            <Switch>
              <Route exact path={ROOT_ROUTE}>
                {this.isAuthSuccess ? <Redirect to={INBOX_ROUTE} /> : <Redirect to={LOGIN_ROUTE} />}
              </Route>
              <Route exact path={TAGS_ROUTE} component={Tags} />
              <Route exact path={LOGIN_ROUTE} component={Login} />
              <Route path={INBOX_ROUTE} component={Inbox} />
              <Route exact path={LOGOUT_ROUTE} component={Logout} />
              <Route path={CHANNELS_ROUTE} component={Channels} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </AiryWebSocket>
    );
  }
}

export default withRouter(connector(App));
