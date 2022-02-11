import React, {useCallback} from 'react';
import {connect} from 'react-redux';
import {StateModel} from '../reducers';
import {Settings} from '../reducers/data/settings';

import styles from './ColorSelector.module.scss';

import {
  cyTagsDialogColorSelectorBlue,
  cyTagsDialogColorSelectorRed,
  cyTagsDialogColorSelectorGreen,
  cyTagsDialogColorSelectorPurple,
} from 'handles';

type ColorSelectorProps = {
  handleUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  color: string;
  editing?: boolean;
  id?: string;
};

type ColorSelectorState = {
  settings: Settings;
};

const ColorSelector = ({handleUpdate, color, editing, id, settings}: ColorSelectorProps & ColorSelectorState) => {
  const getColorValue = useCallback(
    (color: string) => (settings && settings.colors[color].deflt) || '1578D4',
    [settings]
  );
  const dataCyTagsDialogColorSelectorBlue = cyTagsDialogColorSelectorBlue;
  const dataCyTagsDialogColorSelectorRed = cyTagsDialogColorSelectorRed;
  const dataCyTagsDialogColorSelectorGreen = cyTagsDialogColorSelectorGreen;
  const dataCyTagsDialogColorSelectorPurple = cyTagsDialogColorSelectorPurple;

  return (
    <div className={`${styles.colorSelector} ${editing ? '' : 'done'}`}>
      <div>
        <input
          className={styles.colorPicker}
          type="radio"
          onChange={handleUpdate}
          checked={color === 'tag-blue'}
          id={`color-blue-${id}`}
          name={`color-blue-${id}`}
          value="tag-blue"
          data-cy={dataCyTagsDialogColorSelectorBlue}
        />
        <label htmlFor={`color-blue-${id}`}>
          <span style={{backgroundColor: `#${getColorValue('tag-blue')}`}} />
        </label>
      </div>
      <div>
        <input
          className={styles.colorPicker}
          type="radio"
          onChange={handleUpdate}
          checked={color === 'tag-red'}
          id={`color-red-${id}`}
          name={`color-red-${id}`}
          value="tag-red"
          data-cy={dataCyTagsDialogColorSelectorRed}
        />
        <label htmlFor={`color-red-${id}`}>
          <span style={{backgroundColor: `#${getColorValue('tag-red')}`}} />
        </label>
      </div>
      <div>
        <input
          className={styles.colorPicker}
          type="radio"
          onChange={handleUpdate}
          checked={color === 'tag-green'}
          id={`color-green-${id}`}
          name={`color-green-${id}`}
          value="tag-green"
          data-cy={dataCyTagsDialogColorSelectorGreen}
        />
        <label htmlFor={`color-green-${id}`}>
          <span style={{backgroundColor: `#${getColorValue('tag-green')}`}} />
        </label>
      </div>
      <div>
        <input
          className={styles.colorPicker}
          type="radio"
          onChange={handleUpdate}
          checked={color === 'tag-purple'}
          id={`color-purple-${id}`}
          name={`color-purple-${id}`}
          value="tag-purple"
          data-cy={dataCyTagsDialogColorSelectorPurple}
        />
        <label htmlFor={`color-purple-${id}`}>
          <span style={{backgroundColor: `#${getColorValue('tag-purple')}`}} />
        </label>
      </div>
    </div>
  );
};

const mapStateToProps = (state: StateModel) => {
  return {
    settings: state.data.settings,
  };
};

export default connect(mapStateToProps)(ColorSelector);
