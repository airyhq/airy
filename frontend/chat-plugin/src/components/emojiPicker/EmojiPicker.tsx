import React from 'react';
import asyncComponent from './asyncComponent';


const EmojiPicker = asyncComponent((addEmoji) => {
    return import('./EmojiPickerComponent').then((c) => {
        c.EmojiPickerComponent(addEmoji); // send props or params here
   })
});


export const EmojiPickerContainer = ({addEmoji}) => {
    return (
      
            <EmojiPicker addEmoji={addEmoji} />
   
    );
};