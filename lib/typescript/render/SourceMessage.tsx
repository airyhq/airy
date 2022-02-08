import React from 'react';
import {renderProviders} from './renderProviders';
import {Text} from './components/Text';
import {UnknownSourceText} from './components/UnknownSourceText';
import {RenderPropsUnion} from './props';

type SourceMessageState = {
  hasError: boolean;
  customFont?: string;
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

  unknownSource() {
    let message;
    if (this.props.message.content.text) {
      message = this.props.message.content.text;
    } else {
      message = JSON.stringify(this.props.message.content, null, 2);
    }

    return (
      <UnknownSourceText
        fromContact={this.props.message.fromContact || false}
        text={message}
        sourceName={this.props.source}
      />
    );
  }

  errorFallback() {
    return <Text fromContact={this.props.message.fromContact || false} text="Could not render this content" />;
  }

  render() {
    const provider = renderProviders[this.props.source];

    if (provider === undefined || this.props.source === undefined) {
      return this.unknownSource();
    }

    if (this.state.hasError) {
      return this.errorFallback();
    }

    try {
      return provider(this.props);
    } catch (e) {
      console.error(e);
      return this.unknownSource();
    }
  }
}
