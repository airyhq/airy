import _redux from 'redux';
import _, {createSelector} from 'reselect';
import {Tag} from '../model/Tag';
import {RootState} from '../reducers';

const tags = (state: RootState) => state.data.tags.all;
const queries = (state: RootState) => state.data.tags.query;
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
