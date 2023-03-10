import {StateModel} from '../reducers';

export const getValidTopics = (state: StateModel) => {
  return state.data.streams.topics
    .filter((topic: string) => {
      if (
        !(
          topic.includes('KSTREAM') ||
          topic.includes('KTABLE') ||
          topic.includes('STATE-STORE') ||
          topic.includes('FK-JOIN') ||
          topic.includes('-changelog') ||
          topic.includes('-repartition')
        )
      ) {
        return topic;
      }
    })
    .sort();
};
