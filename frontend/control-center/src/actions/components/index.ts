import {Dispatch} from 'react';
import {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {EnableDisableComponentRequestPayload, UpdateComponentConfigurationRequestPayload} from 'httpclient/src';

//const ENABLE_DISABLE_COMPONENT = '@@component/ENABLE_DISABLE';
const UPDATE_COMPONENT_CONFIGURATION = '@@component/UPDATE_CONFIG';

// export const enableDisableComponentAction = createAction(
//   ENABLE_DISABLE_COMPONENT,
//   (components: EnableDisableComponentRequestPayload) => ({
//     components,
//   })
// )<{components: EnableDisableComponentRequestPayload}>();

export const updateComponentConfigurationAction = createAction(UPDATE_COMPONENT_CONFIGURATION, 
  (updatedComponentData: UpdateComponentConfigurationRequestPayload) => ({updatedComponentData,})
  )<{updatedComponentData: UpdateComponentConfigurationRequestPayload}>();

export const enableDisableComponent =
  (enableDisableComponentRequestPayload: EnableDisableComponentRequestPayload) => (dispatch: Dispatch<any>) => {
    return HttpClientInstance.enableDisableComponent(enableDisableComponentRequestPayload).then(() => {
      //dispatch(enableDisableComponentAction(enableDisableComponentRequestPayload));
      return Promise.resolve(true);
    });
  };

export const updateComponentConfiguration = (updateComponentConfigurationRequestPayload: UpdateComponentConfigurationRequestPayload) => (dispatch: Dispatch<any>) => {
  return HttpClientInstance.updateComponentConfiguration(updateComponentConfigurationRequestPayload).then(() => {
    console.log('updateConfig payload', updateComponentConfigurationRequestPayload)
    dispatch(updateComponentConfigurationAction(updateComponentConfigurationRequestPayload));
    return Promise.resolve(true);
  })
}
