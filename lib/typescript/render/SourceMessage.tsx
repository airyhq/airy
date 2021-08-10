import React from 'react';
import {renderProviders} from './renderProviders';

import {Text} from './components/Text';
import {RenderPropsUnion} from './props';

type SourceMessageState = {
  hasError: boolean;
};

export class SourceMessage extends React.Component<RenderPropsUnion, SourceMessageState> {
  constructor(props: RenderPropsUnion) {
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
    return <Text fromContact={this.props.message.fromContact || false} text="Could not render this content" />;
  }

  render() {
    const provider = renderProviders[this.props.source];
    if (this.state.hasError || this.props.source === undefined || provider === undefined) {
      return this.errorFallback();
    }

    try {
      return provider(this.props);
    } catch (e) {
      console.error(e);
      return this.errorFallback();
    }
  }
}
