import React, {Component} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, Route, Switch, Redirect, RouteComponentProps} from 'react-router-dom';

import TopBar from './components/TopBar';
import Channels from './pages/Channels';
import Inbox from './pages/Inbox';
import Tags from './pages/Tags';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';
import AiryWebSocket from './components/AiryWebsocket';
import {fakeSettingsAPICall} from './actions/settings';
import {StateModel} from './reducers';

import {INBOX_ROUTE, CHANNELS_ROUTE, ROOT_ROUTE, TAGS_ROUTE} from './routes/routes';

import styles from './App.module.scss';

const mapStateToProps = (state: StateModel, ownProps: RouteComponentProps) => {
  return {
    user: state.data.user,
    pathname: ownProps.location.pathname,
  };
};

const mapDispatchToProps = {
  fakeSettingsAPICall,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

class App extends Component<ConnectedProps<typeof connector> & RouteComponentProps> {
  constructor(props: ConnectedProps<typeof connector> & RouteComponentProps) {
    super(props);
  }

  componentDidMount() {
    this.props.fakeSettingsAPICall();
  }

  render() {
    /* TODO Add this logic back in: https://github.com/airyhq/airy/issues/1519
    if (!this.props.user.id) {
        return <Route path="*" component={AiryLoader} />;
    }*/

    return (
      <AiryWebSocket>
        <div className={styles.Container}>
          <div className={styles.ContainerApp}>
            <>
              <TopBar isAdmin={true} />
              <Sidebar />
            </>
            <Switch>
              <Route exact path={ROOT_ROUTE}>
                <Redirect to={INBOX_ROUTE} />
              </Route>
              <Route exact path={TAGS_ROUTE} component={Tags} />
              <Route path={INBOX_ROUTE} component={Inbox} />
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
