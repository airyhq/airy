import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {UpdateComponentConfigurationRequestPayload} from 'httpclient/src';
import {Components} from 'model';

const UPDATE_CONNECTOR_CONFIGURATION = '@@connector/UPDATE_CONNECTOR_CONFIG';
const GET_COMPONENTS = '@@connector/GET_COMPONENTS';

export const updateConnectorConfigurationAction = createAction(
  UPDATE_CONNECTOR_CONFIGURATION,
  (updatedComponentData: UpdateComponentConfigurationRequestPayload) => updatedComponentData
)<UpdateComponentConfigurationRequestPayload>();

export const getComponentsAction = createAction(GET_COMPONENTS, (components: Components) => components)<Components>();

export const getConnectorsConfiguration = () => (dispatch: Dispatch<any>) => {
  return HttpClientInstance.getComponents().then((response: Components) => {
    dispatch(getComponentsAction(response));
    return Promise.resolve(true);
  });
};

export const updateConnectorConfiguration =
  (updateConnectorConfigurationRequestPayload: UpdateComponentConfigurationRequestPayload) =>
  (dispatch: Dispatch<any>) => {
    return HttpClientInstance.updateComponentConfiguration(updateConnectorConfigurationRequestPayload).then(() => {
      dispatch(updateConnectorConfigurationAction(updateConnectorConfigurationRequestPayload));
      return Promise.resolve(true);
    });
  };
