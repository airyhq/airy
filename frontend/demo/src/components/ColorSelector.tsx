import React, {useCallback} from 'react';
import {connect} from 'react-redux';
import {RootState} from '../reducers';
import {Settings} from '../reducers/data/settings';

import styles from './ColorSelector.module.scss';

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
  const getColorValue = useCallback((color: string) => (settings && settings.colors[color].default) || '1578D4', [
    settings,
  ]);

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
        />
        <label htmlFor={`color-purple-${id}`}>
          <span style={{backgroundColor: `#${getColorValue('tag-purple')}`}} />
        </label>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    settings: state.data.settings,
  };
};

export default connect(mapStateToProps)(ColorSelector);
