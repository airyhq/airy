import React from 'react';
import {renderProviders} from './renderProviders';

import {Text} from './components/Text';
import {getDefaultMessageRenderingProps, MessageRenderProps} from './shared';

export * from './shared';

type SourceMessageState = {
  hasError: boolean;
};

export class SourceMessage extends React.Component<MessageRenderProps, SourceMessageState> {
  constructor(props: MessageRenderProps) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  errorFallback() {
    return <Text {...getDefaultMessageRenderingProps(this.props)} text="Could not render this content" />;
  }

  render() {
    if (this.state.hasError) {
      return this.errorFallback();
    }

    const provider = renderProviders[this.props.source];

    try {
      return provider(this.props);
    } catch (e) {
      console.error(e);
      return this.errorFallback();
    }
  }
}
