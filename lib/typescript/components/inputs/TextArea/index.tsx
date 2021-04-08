import React, {Component} from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import {Input, InputProps} from '../Input';
import styles from './style.module.scss';

class TextAreaComponent extends Component<IProps & InputProps> {
  classForState = currentValidationState => {
    switch (currentValidationState) {
      case 'inputInvalid':
        return styles.inputInvalid;
      case 'inputValid':
        return styles.inputValid;
      default:
        return '';
    }
  };

  renderComponent = props => {
    const {
      id,
      inputRef,
      placeholder,
      onChange,
      onBlur,
      type,
      value,
      autoFocus,
      name,
      minLength,
      maxLength,
      required,
      fontClass,
      currentValidationState,
      dataCy,
    } = props;

    const inputClass = `${styles.textarea} ${fontClass || 'font-l'} ${this.classForState(currentValidationState)}`;
    return (
      <TextareaAutosize
        id={id}
        ref={inputRef}
        className={inputClass}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        value={value}
        autoFocus={autoFocus}
        name={name}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        rows={this.props.minRows}
        maxRows={this.props.maxRows}
        data-cy={dataCy}
      />
    );
  };

  render() {
    return (
      <Input {...this.props} inputComponent={this.renderComponent}>
        {this.props.children}
      </Input>
    );
  }
}

interface IProps {
  minRows: number;
  maxRows: number;
}

export const TextArea = TextAreaComponent;
