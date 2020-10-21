import React, { Component } from "react";
import _, { withTranslation, WithTranslation } from "react-i18next";
import TextareaAutosize from "react-autosize-textarea";

import { Input, InputProps } from "../Input";
import styles from "./style.module.scss";

class TextAreaComponent extends Component<
  WithTranslation & IProps & InputProps
> {
  classForState = currentValidationState => {
    switch (currentValidationState) {
      case "inputInvalid":
        return styles.inputInvalid;
      case "inputValid":
        return styles.inputValid;
      default:
        return "";
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
      currentValidationState
    } = props;

    const inputClass = `${styles.textarea} ${fontClass ||
      "font-l"} ${this.classForState(currentValidationState)}`;
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

export const TextArea = withTranslation()(TextAreaComponent);
