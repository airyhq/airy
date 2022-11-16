import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {InstallUninstallComponentRequestPayload} from 'httpclient/src';
import {Components} from 'model';

const LIST_COMPONENT = '@@catalog/LIST_COMPONENT';
const INSTALL_COMPONENT = '@@catalog/INSTALL_COMPONENT';
const UNINSTALL_COMPONENT = '@@catalog/UNINSTALL_COMPONENT';
const UPDATE_INSTALLATION_STATUS = '@@catalog/UPDATE_INSTALLATION_STATUS';

type ComponentInstallationStatus = {status: 'installed' | 'pending' | 'uninstalled'};

export const listComponentsAction = createAction(
  LIST_COMPONENT,
  (componentsList: Components) => componentsList
)<Components>();

export const installComponentAction = createAction(
  INSTALL_COMPONENT,
  (installedComponent: InstallUninstallComponentRequestPayload) => installedComponent
)<InstallUninstallComponentRequestPayload>();

export const uninstallComponentAction = createAction(
  UNINSTALL_COMPONENT,
  (uninstalledComponent: InstallUninstallComponentRequestPayload) => uninstalledComponent
)<InstallUninstallComponentRequestPayload>();

export const updateComponentInstallationStatusAction = createAction(
  UPDATE_INSTALLATION_STATUS,
  (installationStatus: ComponentInstallationStatus) => installationStatus
)<ComponentInstallationStatus>();

export const listComponents = () => (dispatch: Dispatch<any>) => {
  return HttpClientInstance.listComponents().then(response => {
    dispatch(listComponentsAction(response));
    return Promise.resolve(true);
  });
};

export const installComponent =
  (installComponentRequestPayload: InstallUninstallComponentRequestPayload) => (dispatch: Dispatch<any>) => {
    return HttpClientInstance.installComponent(installComponentRequestPayload).then(() => {
      dispatch(installComponentAction(installComponentRequestPayload));
      return Promise.resolve(true);
    });
  };

export const uninstallComponent =
  (uninstallComponentRequestPayload: InstallUninstallComponentRequestPayload) => (dispatch: Dispatch<any>) => {
    return HttpClientInstance.uninstallComponent(uninstallComponentRequestPayload).then(() => {
      dispatch(uninstallComponentAction(uninstallComponentRequestPayload));
      return Promise.resolve(true);
    });
  };

export const updateComponentStatus =
  (installationStatusPayload: ComponentInstallationStatus) => (dispatch: Dispatch<any>) => {
    return dispatch(updateComponentInstallationStatusAction(installationStatusPayload));
  };
