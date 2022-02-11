import _typesafe, {createAction} from 'typesafe-actions';
import {Settings} from '../../reducers/data/settings';
import {Config} from "../../../../../lib/typescript/model";

const ADD_SETTINGS_TO_STORE = 'ADD_SETTINGS_TO_STORE';

export const saveSettings = createAction(ADD_SETTINGS_TO_STORE, (config: Config) => {
  const {tagConfig} = config;
  return {"colors": Object.keys(tagConfig.colors).reduce( (agg2, key2) => {
      let newKey = "";
      for (var i = 0; i < key2.length; i++) {
        const character = key2.charAt(i);
        if (character == character.toUpperCase()) {
          newKey += "-"+character.toLowerCase();
        } else {
          newKey += character
        }
      }
      return {
        ...agg2,
        [newKey]: tagConfig.colors[key2],
      }
    }, {})
  };
})<Settings>();
