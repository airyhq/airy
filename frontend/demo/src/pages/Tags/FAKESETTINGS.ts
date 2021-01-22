import {Settings} from '../../reducers/data/settings';

export const fakeData = (): Settings => {
  return {
    colors: {
      'tag-green': {default: '0E764F', background: 'F5FFFB', font: '0E764F', position: 3, border: '0E764F'},
      'tag-blue': {default: '1578D4', background: 'F1FAFF', font: '1578D4', position: 1, border: '1578D4'},
      'tag-red': {default: 'E0243A', background: 'FFF7F9', font: 'E0243A', position: 2, border: 'E0243A'},
      'tag-purple': {default: '730A80', background: 'FEF7FF', font: '730A80', position: 4, border: '730A80'},
    },
  };
};
