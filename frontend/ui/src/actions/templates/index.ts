import _, {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';

import {ListTemplatesRequestPayload, ListTemplatesPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

const LIST_TEMPLATES = 'LIST_TEMPLATES';

export const listTemplatesAction = createAction(LIST_TEMPLATES, resolve => (templates: ListTemplatesPayload) =>
  resolve(templates)
);

export function listTemplates(requestPayload: ListTemplatesRequestPayload) {
  return function(dispatch: Dispatch<any>) {
    return HttpClientInstance.listTemplates(requestPayload).then((response: ListTemplatesPayload) => {
      dispatch(listTemplatesAction(response));
    });
  };
}
