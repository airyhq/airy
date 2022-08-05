import React from 'react';
// @ts-ignore
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export const EmojiPicker = ({addEmoji}) => {
  return <Picker data={data} previewPosition="none" onEmojiSelect={addEmoji} />;
};
