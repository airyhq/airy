import React, {useState} from 'react';
import {Input, ListenOutsideClick} from 'components';
import styles from './styles.module.css';
import {SketchPicker} from 'react-color';
import {AiryChatPlugin} from 'chat-plugin';

export const ChatDemo = () => {
  const [headerText, setHeaderText] = useState('');
  const [startNewConversationText, setStartNewConversationText] = useState('');
  const [bubbleIconUrl, setBubbleIconUrl] = useState('');
  const [sendMessageIconUrl, setSendMessageIconUrl] = useState('');
  const [headerTextColor, setHeaderTextColor] = useState('');
  const [showHeaderTextColorPicker, setShowHeaderTextColorPicker] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('');
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false);
  const [accentColor, setAccentColor] = useState('');
  const [showAccentColorPicker, setShowAccentColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);

  const toggleShowHeaderTextColorPicker = () => {
    setShowHeaderTextColorPicker(!showHeaderTextColorPicker);
  };

  const toggleShowPrimaryColorPicker = () => {
    setShowPrimaryColorPicker(!showPrimaryColorPicker);
  };

  const toggleShowAccentColorPicker = () => {
    setShowAccentColorPicker(!showAccentColorPicker);
  };

  const toggleShowBackgroundColorPicker = () => {
    setShowBackgroundColorPicker(!showBackgroundColorPicker);
  };

  const demoConfig = {
    apiHost: env.API_HOST,
    channelId,
    config: {
      showMode: true,
      ...(headerText && {headerText}),
      ...(startNewConversationText && {startNewConversationText}),
      ...(headerTextColor && {headerTextColor}),
      ...(primaryColor && {primaryColor}),
      ...(accentColor && {accentColor}),
      ...(backgroundColor && {backgroundColor}),
      ...(bubbleIconUrl && {bubbleIcon: bubbleIconUrl}),
      ...(sendMessageIconUrl && {sendMessageIcon: sendMessageIconUrl}),
    },
  };

  return (
    <>      
      <div className={styles.customiseContainer}>
        <Input
          type="text"
          name="textHeader"
          value={headerText}
          onChange={(e) => {
            setHeaderText(e.target.value);
          }}
          label="Header Text"
          placeholder="(optionally) add a text"
          height={32}
          fontClass="font-base"
        />
        <Input
          type="text"
          name="startNewConversationText"
          value={startNewConversationText}
          onChange={(e) => {
            setStartNewConversationText(e.target.value);
          }}
          label="Start new Conversation Text"
          placeholder="(optionally) add a text"
          height={32}
          fontClass="font-base"
        />
        <Input
          type="url"
          name="bubbleIconUrl"
          value={bubbleIconUrl}
          onChange={(e) => {
            setBubbleIconUrl(e.target.value);
          }}
          label="Chat Plugin Icon URL"
          placeholder="(optionally) add an image url"
          height={32}
          fontClass="font-base"
          showErrors={false}
        />
        <Input
          type="text"
          name="sendMessageIconUrl"
          value={sendMessageIconUrl}
          onChange={(e) => {
            setSendMessageIconUrl(e.target.value);
          }}
          label="Input Icon URL"
          placeholder="(optionally) add an image url"
          height={32}
          fontClass="font-base"
          showErrors={false}
        />
        <p>Header Text Color</p>
        <div className={styles.colorPicker}>
          {showHeaderTextColorPicker && (
            <ListenOutsideClick className={styles.colorPickerWrapper} onOuterClick={toggleShowHeaderTextColorPicker}>
              <SketchPicker
                color={headerTextColor}
                onChangeComplete={(color) => {
                  setHeaderTextColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: headerTextColor}}
            onClick={toggleShowHeaderTextColorPicker}
          />
          <Input
            type="text"
            name="Header Text Color"
            value={headerTextColor}
            onChange={(e) => {
              setHeaderTextColor(e.target.value);
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value !== '') {
                const newHeaderTextColor = value.startsWith('#') ? value : '#' + value;
                setHeaderTextColor(newHeaderTextColor.toUpperCase());
              } else {
                setHeaderTextColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div>
        <p>Primary Color</p>
        <div className={styles.colorPicker}>
          {showPrimaryColorPicker && (
            <ListenOutsideClick className={styles.colorPickerWrapper} onOuterClick={toggleShowPrimaryColorPicker}>
              <SketchPicker
                color={primaryColor}
                onChangeComplete={(color) => {
                  setPrimaryColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: primaryColor}}
            onClick={toggleShowPrimaryColorPicker}
          />
          <Input
            type="text"
            name="Primary Color"
            value={primaryColor}
            onChange={(e) => {
              setPrimaryColor(e.target.value);
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value !== '') {
                const newPrimaryColor = value.startsWith('#') ? value : '#' + value;
                setPrimaryColor(newPrimaryColor.toUpperCase());
              } else {
                setPrimaryColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div>
        <p>Accent Color</p>
        <div className={styles.colorPicker}>
          {showAccentColorPicker && (
            <ListenOutsideClick className={styles.colorPickerWrapper} onOuterClick={toggleShowAccentColorPicker}>
              <SketchPicker
                color={accentColor}
                onChangeComplete={(color) => {
                  setAccentColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}

          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: accentColor}}
            onClick={toggleShowAccentColorPicker}
          />
          <Input
            type="text"
            name="accentColor"
            value={accentColor}
            onChange={(e) => {
              setAccentColor(e.target.value);
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value !== '') {
                const newAccentColor = value.startsWith('#') ? value : '#' + value;
                setAccentColor(newAccentColor.toUpperCase());
              } else {
                setAccentColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div>
        <p>Background Color</p>
        <div className={styles.colorPicker}>
          {showBackgroundColorPicker && (
            <ListenOutsideClick className={styles.colorPickerWrapper} onOuterClick={toggleShowBackgroundColorPicker}>
              <SketchPicker
                color={backgroundColor}
                onChangeComplete={(color) => {
                  setBackgroundColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: backgroundColor}}
            onClick={toggleShowBackgroundColorPicker}
          />
          <Input
            type="text"
            name="backgroundColor"
            value={backgroundColor}
            onChange={(e) => {
              setBackgroundColor(e.target.value);
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (value !== '') {
                const newBackgroundColor = value.startsWith('#') ? value : '#' + value;
                setBackgroundColor(newBackgroundColor.toUpperCase());
              } else {
                setBackgroundColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div>
      </div>
      <div className="demoChatPlugin">
        <AiryChatPlugin config={demoConfig} />
      </div>
    </>
  );
};
