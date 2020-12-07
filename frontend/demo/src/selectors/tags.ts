import _, {createSelector} from 'reselect';
import * as all from 'redux';
import {Tag} from '../model/Tag';
import {RootState} from '../reducers';

export const filteredTags = createSelector(
  (state: RootState) => state.data.tags.all,
  (state: RootState) => state.data.tags.query,
  (tags, filter) => {
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
  }
);
