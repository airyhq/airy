import {Dispatch} from 'react';
import {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {EnableDisableComponentRequestPayload} from 'httpclient/src';

const ENABLE_DISABLE_COMPONENT = '@@component/ENABLE_DISABLE';

export const enableDisableComponentAction = createAction(
  ENABLE_DISABLE_COMPONENT,
  (compoents: EnableDisableComponentRequestPayload) => ({
    compoents,
  })
)<{compoents: EnableDisableComponentRequestPayload}>();

export const enableDisableComponent =
  (enableDisableComponentRequestPayload: EnableDisableComponentRequestPayload) => (dispatch: Dispatch<any>) => {
    return HttpClientInstance.enableDisableComponent(enableDisableComponentRequestPayload).then(() => {
      dispatch(enableDisableComponentAction(enableDisableComponentRequestPayload));
      return Promise.resolve(true);
    });
  };
