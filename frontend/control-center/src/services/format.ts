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

export const isJSON = (string: string): boolean => {
  try {
    return JSON.parse(string) && !!string;
  } catch (e) {
    return false;
  }
};

export const formatJSON = (jsonString: string): string => {
  if (jsonString) {
    return JSON.stringify(JSON.parse(jsonString), null, 4);
  }
  return '';
};

export const calculateHeightOfCodeString = (code: string) => {
  const lineHeight = 18;
  const numLine = code.split('\n').length + 1;
  if (numLine === 0) return 200;
  return numLine * lineHeight;
};

export const getValuesFromSchema = (schema: string) => {
  const values = [];
  const schemaJSON = JSON.parse(schema);
  const fields = schemaJSON['fields'];
  if (fields) {
    for (const field of fields) {
      values.push(field);
    }
  }
  return values;
};
