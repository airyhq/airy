import React from 'react';
import useThemeContext from '@theme/hooks/useThemeContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

const Image = ({lightModePath, darkModePath}) => {
  const {isDarkTheme} = useThemeContext();

  if (isDarkTheme) {
    return <img alt={darkModePath} src={useBaseUrl(darkModePath)} />;
  }
  return <img alt={lightModePath} src={useBaseUrl(lightModePath)} />;
};

export default Image;
