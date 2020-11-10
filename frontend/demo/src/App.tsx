import React, { Component } from "react";
import _, { connect, ConnectedProps } from "react-redux";
import {
  withRouter,
  Route,
  Switch,
  Redirect,
  RouteComponentProps
} from "react-router-dom";

import { AiryLoader } from "@airyhq/components";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";

import { StateModel } from "./reducers";
import { LOGIN_ROUTE, ROOT_ROUTE } from "./routes/routes";

import styles from "./App.module.scss";

const publicRoutes = [LOGIN_ROUTE];

const shouldRedirect = (path: string) =>
  publicRoutes.filter((route: string) => path.indexOf(route) !== -1).length ===
  0;

class App extends Component<
  ConnectedProps<typeof connector> & RouteComponentProps
> {
  constructor(props: ConnectedProps<typeof connector> & RouteComponentProps) {
    super(props);
  }

  get isAuthSuccess() {
    return this.props.user.id.length;
  }

  render() {
    if (!this.props.user.id) {
      if (this.props.refreshToken) {
        return <Route path="*" component={AiryLoader} />;
      } else if (shouldRedirect(this.props.location.pathname)) {
        return <Redirect to={LOGIN_ROUTE} />;
      }
    }

    const shouldShowSidebar = (path: string) => {
      return this.isAuthSuccess;
    };

    return (
      <div className={styles.Container}>
        <div
          className={`${
            this.isAuthSuccess
              ? styles.ContainerApp
              : styles.ContainerAppNotLogin
          }`}
        >
          {shouldShowSidebar(this.props.location.pathname) ? (
            <>
              <TopBar isAdmin={true} />
              <Sidebar />
            </>
          ) : (
            <div />
          )}
          <Switch>
            <Route exact path={ROOT_ROUTE}>
              {this.isAuthSuccess ? (
                <Redirect to={ROOT_ROUTE} />
              ) : (
                <Redirect to={LOGIN_ROUTE} />
              )}
            </Route>
            <Route exact path={LOGIN_ROUTE} component={Login} />
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
    refreshToken: state.data.user.refresh_token
  };
};

const connector = connect(mapStateToProps, null);

export default withRouter(connector(App));
