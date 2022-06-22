import {Config} from 'model';
import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {UpdateComponentConfigurationRequestPayload, EnableDisableComponentRequestPayload} from 'httpclient/src';

const ENABLE_DISABLE_COMPONENT = '@@component/ENABLE_DISABLE';
const UPDATE_COMPONENT_CONFIGURATION = '@@component/UPDATE_CONFIG';
const ADD_SETTINGS_TO_STORE = 'ADD_CONFIG_TO_STORE';

export const saveClientConfigAction = createAction(ADD_SETTINGS_TO_STORE, (config: Config) => config)<Config>();
export const enableDisableComponentAction = createAction(
  ENABLE_DISABLE_COMPONENT,
  (components: EnableDisableComponentRequestPayload) => components)<EnableDisableComponentRequestPayload>();

export const updateComponentConfigurationAction = createAction(UPDATE_COMPONENT_CONFIGURATION, 
  (updatedComponentData: UpdateComponentConfigurationRequestPayload) => updatedComponentData)
  <UpdateComponentConfigurationRequestPayload>();


export const getClientConfig = () => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.getConfig().then((response: Config) => {
    dispatch(saveClientConfigAction(response));
    return Promise.resolve(true);
  });
};

export const enableDisableComponent =
  (enableDisableComponentRequestPayload: EnableDisableComponentRequestPayload) => (dispatch: Dispatch<any>) => {
    return HttpClientInstance.enableDisableComponent(enableDisableComponentRequestPayload).then(() => {
      dispatch(enableDisableComponentAction(enableDisableComponentRequestPayload));
      return Promise.resolve(true);
    });
  };

export const updateComponentConfiguration = (updateComponentConfigurationRequestPayload: UpdateComponentConfigurationRequestPayload) => (dispatch: Dispatch<any>) => {
  return HttpClientInstance.updateComponentConfiguration(updateComponentConfigurationRequestPayload).then(() => {
    dispatch(updateComponentConfigurationAction(updateComponentConfigurationRequestPayload));
    return Promise.resolve(true);
  })
}


