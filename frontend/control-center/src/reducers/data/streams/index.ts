import {Streams} from 'model/Streams';
import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/streams';

type Action = ActionType<typeof actions>;

const defaultState = {
  topics: [],
  schemas: {},
};

const transformTopics = (topics: string[]): string[] => {
  const newTopicsList = [];
  topics.forEach((topic: string) => {
    newTopicsList.push(trimTopicName(topic));
  });
  return newTopicsList;
};

const trimTopicName = (name: string): string => {
  if (name) return name.replace('-value', '');
  return 'Not found';
};

export default function configReducer(state = defaultState, action: Action): Streams {
  switch (action.type) {
    case getType(actions.setTopicsAction):
      return {
        ...state,
        topics: transformTopics(action.payload),
      };
    case getType(actions.setCurrentTopicInfoAction): {
      const topicName = trimTopicName(action.payload['subject']);
      return {
        ...state,
        schemas: {
          ...state.schemas,
          [topicName]: action.payload,
        },
      };
    }
    default:
      return state;
  }
}
