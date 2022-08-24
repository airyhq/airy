export const capitalizeTitle = (str: string) => {
  return str.split(' ').map(capitalize).join(' ');
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removePrefix = (name: string) => name.split('/').pop();

export const formatComponentNameToConfigKey = (componentName: string) => componentName.split('/')[1];
