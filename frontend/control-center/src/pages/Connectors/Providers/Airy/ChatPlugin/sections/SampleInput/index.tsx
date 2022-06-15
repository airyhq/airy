import {Input} from 'components';
import React, {Dispatch, SetStateAction, useEffect, useRef} from 'react';

type SampleInputProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  name: string;
  placeholder: string;
};

export const SampleInput = (props: SampleInputProps) => {
  const {value, setValue, name, placeholder} = props;

  return (
    <Input
      type="text"
      name={name}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      }}
      onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value !== '') {
          const newColor = value.startsWith('#') ? value : '#' + value;
          setValue(newColor.toUpperCase());
        } else {
          setValue(placeholder);
        }
      }}
      placeholder={placeholder}
      height={32}
      fontClass="font-base"
    />
  );
};
