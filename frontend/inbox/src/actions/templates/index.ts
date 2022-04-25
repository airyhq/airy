import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';

import {Template} from 'model';
import {ListTemplatesRequestPayload} from 'httpclient/src';
import {HttpClientInstance} from '../../httpClient';

const LIST_TEMPLATES = 'LIST_TEMPLATES';

export const listTemplatesAction = createAction(LIST_TEMPLATES, (source: string, templates: Template[]) => ({
  source,
  templates,
}))<{source: string; templates: Template[]}>();

export function listTemplates(requestPayload: ListTemplatesRequestPayload) {
  return function (dispatch: Dispatch<any>) {
    return HttpClientInstance.listTemplates(requestPayload).then((response: Template[]) => {
      dispatch(listTemplatesAction(requestPayload.source, response));

      return Promise.resolve(true);
    });
  };
}
