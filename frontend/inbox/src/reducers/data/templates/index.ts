import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/templates';
import {Template} from 'model';
import {DataState} from '../../data';

type Action = ActionType<typeof actions>;

export type TemplateState = {
  data: DataState;
};

export type Templates = {
  all: Template[];
  source: string;
};

const defaultState = {
  all: [],
};

export default function templatesReducer(state = defaultState, action: Action): any {
  switch (action.type) {
    case getType(actions.listTemplatesAction):
      return {
        ...state,
        all: action.payload.templates,
        source: action.payload.source,
      };

    default:
      return state;
  }
}
