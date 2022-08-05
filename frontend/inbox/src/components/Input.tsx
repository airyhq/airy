import React from 'react';
// @ts-ignore
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {Input as LibInput} from 'components';

const renderPicker = onSelect => (
  <Picker
    data={data}
    previewPosition="none"
    onEmojiSelect={onSelect}
    style={{right: '28px', position: 'absolute', bottom: '-84px'}}
  />
);

export const Input = props => <LibInput {...props} renderEmojiPicker={renderPicker} />;
