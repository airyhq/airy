import React, {Component} from 'react';

interface EmojiPickerWrapperProps {
  addEmoji: (emoji) => void;
}

export const EmojiPickerWrapper = ({addEmoji}: EmojiPickerWrapperProps) => {
  const importEmojiPicker = (importComponent: () => Promise<any>) => {
    return class EmojiPickerComponent extends Component<EmojiPickerWrapperProps> {
      state = {
        emojiPicker: null,
      };

      componentDidMount() {
        importComponent().then(component => {
          this.setState({emojiPicker: component.EmojiPicker});
        });
      }

      render() {
        const EmojiPicker = this.state.emojiPicker;

        return EmojiPicker ? <EmojiPicker addEmoji={addEmoji} /> : null;
      }
    };
  };

  const EmojiPickerImport = importEmojiPicker(() => {
    return import('./EmojiPicker');
  });

  return <EmojiPickerImport addEmoji={addEmoji} />;
};
