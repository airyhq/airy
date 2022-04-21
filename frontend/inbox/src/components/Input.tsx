import React from 'react';
import {Picker} from 'emoji-mart';
import {Input as LibInput} from 'components';

const renderPicker = onSelect => (
  <Picker
    showPreview={false}
    onSelect={onSelect}
    title="Emoji"
    style={{right: '28px', position: 'absolute', bottom: '-84px'}}
  />
);

export const Input = props => <LibInput {...props} renderEmojiPicker={renderPicker} />;
