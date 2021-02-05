import React from 'react';
import {renderProviders} from './renderProviders';

import {Text} from './components/Text';
import {getDefaultMessageRenderingProps, MessageRenderProps} from './shared';

export const SourceMessage = (props: MessageRenderProps) => {
  const provider = renderProviders[props.source];

  try {
    return provider(props);
  } catch (e) {
    console.error(e);
    return <Text {...getDefaultMessageRenderingProps(props)} text="Could not render this content" />;
  }
};
