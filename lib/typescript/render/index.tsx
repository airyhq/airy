import React from 'react';
import {renderProviders} from './renderProviders';
import {getSource} from 'httpclient';

import {Text} from './components/Text';
import {getDefaultMessageRenderingProps, MessageRenderProps} from './shared';

export const SourceMessage = (props: MessageRenderProps) => {
  const source = getSource(props.conversation);

  const provider = renderProviders[source];

  try {
    return provider(props);
  } catch (e) {
    console.error(e);
    return <Text {...getDefaultMessageRenderingProps(props)} text="Could not render this content" />;
  }
};
