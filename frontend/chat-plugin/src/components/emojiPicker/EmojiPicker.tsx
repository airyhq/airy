import React from 'react';
import {Picker} from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

export const EmojiPicker = ({addEmoji}) => {
  return <Picker showPreview={false} title="Emoji" onSelect={addEmoji} />;
};
