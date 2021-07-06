import React, {Component} from 'react';

interface EmojiPickerAsyncLoadProps {
  addEmoji: () => void;
}

export const EmojiPickerAsyncLoad = ({addEmoji}: EmojiPickerAsyncLoadProps) => {
  const loadEmojiPicker = (importComponent: () => Promise<any>) => {
    return class EmojiPickerComponent extends Component<EmojiPickerAsyncLoadProps> {
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

  const EmojiPickerLoading = loadEmojiPicker(() => {
    return import('./EmojiPicker');
  });

  return <EmojiPickerLoading addEmoji={addEmoji} />;
};
