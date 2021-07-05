import React from 'react';
import {Picker} from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

//onSelect={addEmoji} 

export const EmojiPickerComponent = ({addEmoji}) => {

  //console.log('EMOJI PICKER COMPONENT - addEmoji', addEmoji)
  //onSelect={addEmoji}
  return (
      <Picker showPreview={false}  title="Emoji" onSelect={addEmoji}/>
  );
};