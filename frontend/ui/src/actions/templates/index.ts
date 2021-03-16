import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';

import {ListTemplatesRequestPayload, Template} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

const LIST_TEMPLATES = 'LIST_TEMPLATES';

export const listTemplatesAction = createAction(LIST_TEMPLATES, (templates: Template[]) => templates)();

export function listTemplates(requestPayload: ListTemplatesRequestPayload) {
  return function (dispatch: Dispatch<any>) {
    return HttpClientInstance.listTemplates(requestPayload).then((response: Template[]) => {
      if (response.length > 0) {
        dispatch(listTemplatesAction(response));
      }

      return Promise.resolve(true);
    });
  };
}
