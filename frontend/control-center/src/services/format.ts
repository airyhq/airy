import {getSourceForComponent} from 'model';

export const capitalizeTitle = (str: string) => {
  return str.split(' ').map(capitalize).join(' ');
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatName = (str: string) => {
  const name = str
    .split('-')
    .filter(
      element => element !== 'enterprise' && element !== 'sources' && element !== 'connector' && element !== 'frontend'
    )
    .join(' ');
  return capitalizeTitle(name);
};

export const getComponentName = (itemName: string) => {
  if (itemName.includes('frontend-ui')) {
    return 'Airy Inbox';
  }
  if (getSourceForComponent(itemName) && !itemName.includes('enterprise')) {
    return formatName(itemName);
  }

  const formatteComponentName = itemName
    .split('-')
    .filter(element => element !== 'sources' && element !== 'connector' && element !== 'frontend')
    .join(' ');
  return capitalizeTitle(formatteComponentName);
};

export const removePrefix = (name: string) => name.split('/').pop();
