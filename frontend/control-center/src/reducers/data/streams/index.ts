import {Streams} from 'model/Streams';
import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/streams';

type Action = ActionType<typeof actions>;

const defaultState = {
  topics: [],
};

const transformTopics = (topics: string[]): string[] => {
  let newTopicsList = [];
  topics.forEach((topic: string) => {
    newTopicsList.push(topic.replace('-value', ''));
  });
  return newTopicsList;
};

export default function configReducer(state = defaultState, action: Action): Streams {
  switch (action.type) {
    case getType(actions.setTopicsAction):
      return {
        ...state,
        topics: transformTopics(action.payload),
      };
    default:
      return state;
  }
}
