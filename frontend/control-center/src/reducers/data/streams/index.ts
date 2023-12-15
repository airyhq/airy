import {Streams} from 'model/Streams';
import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/streams';

type Action = ActionType<typeof actions>;

const defaultState = {
  topics: [],
  topicsInfo: {},
  topic_schemas: [],
  streams: [],
  schemas: {},
  schemasVersions: {},
  streamsInfo: {},
  messages: {},
};

const transformTopics = (topics: string[]): string[] => {
  const newTopicsList = [];
  topics.forEach((topic: string) => {
    newTopicsList.push(trimTopicName(topic));
  });
  return newTopicsList;
};

const trimTopicName = (name: string): string => {
  if (name) return name; //.replace('-value', '');
  return 'Not found';
};

export default function configReducer(state = defaultState, action: Action): Streams {
  switch (action.type) {
    case getType(actions.setTopicsAction):
      return {
        ...state,
        topics: action.payload,
      };
    case getType(actions.setTopicInfoAction): {
      const topicName = action.payload['name'];
      return {
        ...state,
        topicsInfo: {
          ...state.topicsInfo,
          [topicName]: action.payload,
        },
      };
    }
    case getType(actions.setTopicSchemasAction):
      return {
        ...state,
        topic_schemas: transformTopics(action.payload),
      };
    case getType(actions.setStreamsAction):
      return {
        ...state,
        streams: action.payload,
      };
    case getType(actions.setCurrentSchemaInfoAction): {
      const topicName = trimTopicName(action.payload['subject']);
      return {
        ...state,
        schemas: {
          ...state.schemas,
          [topicName]: action.payload,
        },
      };
    }
    case getType(actions.setCurrentSchemaVersionsAction): {
      const topicName = trimTopicName(action.payload['name']);
      return {
        ...state,
        schemasVersions: {
          ...state.schemasVersions,
          [topicName]: action.payload.versions,
        },
      };
    }
    case getType(actions.setCurrentStreamInfoAction): {
      const streamName = action.payload['name'];
      return {
        ...state,
        streamsInfo: {
          ...state.streamsInfo,
          [streamName]: action.payload,
        },
      };
    }
    case getType(actions.setLastMessage):
      return {
        ...state,
        messages: {
          key: action.payload,
        },
      };
    default:
      return state;
  }
}
