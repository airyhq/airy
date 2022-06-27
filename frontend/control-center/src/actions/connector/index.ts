import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {UpdateComponentConfigurationRequestPayload} from 'httpclient/src';

const UPDATE_CONNECTOR_CONFIGURATION = '@@connector/UPDATE_CONNECTOR_CONFIG';

export const updateConnectorConfigurationAction = createAction(
  UPDATE_CONNECTOR_CONFIGURATION,
  (updatedComponentData: UpdateComponentConfigurationRequestPayload) => updatedComponentData
)<UpdateComponentConfigurationRequestPayload>();

export const updateConnectorConfiguration =
  (updateConnectorConfigurationRequestPayload: UpdateComponentConfigurationRequestPayload) =>
  (dispatch: Dispatch<any>) => {
    return HttpClientInstance.updateComponentConfiguration(updateConnectorConfigurationRequestPayload).then(() => {
      dispatch(updateConnectorConfigurationAction(updateConnectorConfigurationRequestPayload));
      return Promise.resolve(true);
    });
  };
