import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

const Image = ({lightModePath, darkModePath}) => {
  const {isDarkTheme} = useColorMode();

  if (isDarkTheme) {
    return <img alt={darkModePath} src={useBaseUrl(darkModePath)} />;
  }
  return <img alt={lightModePath} src={useBaseUrl(lightModePath)} />;
};

export default Image;
