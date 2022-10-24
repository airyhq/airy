export const capitalizeTitle = (str: string) => {
  return str.split(' ').map(capitalize).join(' ');
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatComponentNameToConfigKey = (componentName: string) => {
  if (!componentName) return null;
  return componentName.split('/')[1];
};
