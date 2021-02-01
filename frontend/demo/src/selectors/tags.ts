import _redux from 'redux';
import _, {createSelector} from 'reselect';
import {Tag} from 'httpclient';
import {StateModel} from '../reducers';

const tags = (state: StateModel) => state.data.tags.all;
const queries = (state: StateModel) => state.data.tags.query;
const filter = (tags: Tag[], filter: string) => {
  if (filter === '') {
    return tags;
  }
  return (
    filter &&
    filter.length &&
    tags.filter((tag: Tag) => {
      return tag.name.toLowerCase().includes(filter.toLowerCase());
    })
  );
};

export const filteredTags = createSelector(tags, queries, filter);
