import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {InstallUninstallComponentRequestPayload} from 'httpclient/src';
import {componentsListMock, ComponentList} from './componentsListMock';

const LIST_COMPONENT = '@@catalog/LIST_COMPONENT';
const INSTALL_COMPONENT = '@@catalog/INSTALL_COMPONENT';
const UNINSTALL_COMPONENT = '@@catalog/UNINSTALL_COMPONENT';

export const listComponentsAction = createAction(
  LIST_COMPONENT,
  (componentsList: ComponentList) => componentsList
)<ComponentList>();

export const installComponentAction = createAction(
  INSTALL_COMPONENT,
  (installedComponent: InstallUninstallComponentRequestPayload) => installedComponent
)<InstallUninstallComponentRequestPayload>();

export const uninstallComponentAction = createAction(
  UNINSTALL_COMPONENT,
  (uninstalledComponent: InstallUninstallComponentRequestPayload) => uninstalledComponent
)<InstallUninstallComponentRequestPayload>();

export const listComponents = () => (dispatch: Dispatch<any>) => {
  //fix this when components.list endpoint has been added
  dispatch(listComponentsAction(componentsListMock));
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
