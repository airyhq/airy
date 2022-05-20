import React, {useRef, useState} from 'react';
import {Input, InputProps} from '../Input';

export const UrlInputField = ({onKeyDown, onChange, ...props}: InputProps) => {
  const inputRef = useRef(null);
  const [value, setValue] = useState(props.value);

  const updateUrl = event => {
    const element = event.target;
    if (element.value.length > 0 && !element.value.match(/http(s)?:\/\//)) {
      console.log('element.value', element.value);
      element.value = `http://${element.value}`;
      if (onChange) {
        onChange(event);
      }
      setValue(element.value);
    }
  };

  const keyDown = event => {
    if (event.key === 'Enter') {
      updateUrl(event);
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  return (
    <Input
      inputRef={inputRef}
      type="url"
      onKeyDown={keyDown}
      onChange={onChange}
      onBlur={updateUrl}
      value={value}
      {...props}
    />
  );
};
