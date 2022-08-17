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

export const removePrefix = (name: string) => name.split('/').pop();
