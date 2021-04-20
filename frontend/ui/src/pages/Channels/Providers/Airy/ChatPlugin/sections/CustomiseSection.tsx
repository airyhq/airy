import React, {createRef, useState} from 'react';
import {Button, Input, ListenOutsideClick} from 'components';
import styles from './CustomiseSection.module.scss';
import {SketchPicker} from 'react-color';
import {AiryChatPlugin, AiryChatPluginConfiguration} from 'chat-plugin';
import {env} from '../../../../../../env';

interface CustomiseSectionProps {
  channelId: string;
  host: string;
}

export const CustomiseSection = ({channelId, host}: CustomiseSectionProps) => {
  const [headerText, setHeaderText] = useState('');
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

  const codeAreaRef = createRef<HTMLTextAreaElement>();

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

  const getTemplateConfig = () => {
    if (
      headerText === '' &&
      bubbleIconUrl === '' &&
      sendMessageIconUrl === '' &&
      headerTextColor === '' &&
      primaryColor === '' &&
      accentColor === '' &&
      backgroundColor === ''
    ) {
      return '';
    }
    let config = '';
    if (headerText !== '') config += `\n              headerText: '${headerText}'`;
    if (bubbleIconUrl !== '') config += `\n              bubbleIcon: '${bubbleIconUrl}'`;
    if (sendMessageIconUrl !== '') config += `\n              sendMessageIcon: '${sendMessageIconUrl}'`;
    if (headerTextColor !== '') config += `\n              headerTextColor: '${headerTextColor}'`;
    if (primaryColor !== '') config += `\n              primaryColor: '${primaryColor}'`;
    if (accentColor !== '') config += `\n              accentColor: '${accentColor}'`;
    if (backgroundColor !== '') config += `\n              backgroundColor: '${backgroundColor}'`;

    return `
        w[n].config = {${config}          
        };`;
  };

  const demoConfig: AiryChatPluginConfiguration = {
    apiHost: env.API_HOST,
    channelId,
    config: {
      showMode: true,
      ...(headerText && {headerText}),
      ...(headerTextColor && {headerTextColor}),
      ...(primaryColor && {primaryColor}),
      ...(accentColor && {accentColor}),
      ...(backgroundColor && {backgroundColor}),
      ...(bubbleIconUrl && {bubbleIcon: bubbleIconUrl}),
      ...(sendMessageIconUrl && {sendMessageIcon: sendMessageIconUrl}),
    },
  };

  const copyToClipboard = () => {
    codeAreaRef.current?.select();
    document.execCommand('copy');
  };

  const generateCode = () => {
    return `<script>
      (function(w, d, s, n) {
        w[n] = w[n] || {};
        w[n].channelId = "${channelId}";
        w[n].host = "${host}";${getTemplateConfig()}
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s);
        j.async = true;
        j.src = w[n].host + "/s.js";
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "airy");
    </script>`;
  };

  return (
    <>
      <div className={styles.codeAreaContainer}>
        <div className={styles.installHint}>
          Add this code inside the tag <code>&lt;head&gt;</code>:
        </div>
        <div>
          <textarea readOnly className={styles.codeArea} ref={codeAreaRef} value={generateCode()} />
        </div>
        <Button onClick={copyToClipboard}>Copy code</Button>
      </div>
      <div className={styles.customiseContainer}>
        <Input
          type="text"
          name="textHeader"
          value={headerText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setHeaderText(e.target.value);
          }}
          label="Header Text"
          placeholder="(optionally) add a text"
          height={32}
          fontClass="font-base"
        />
        <Input
          type="url"
          name="bubbleIconUrl"
          value={bubbleIconUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                onChangeComplete={(color: {hex: string}) => {
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setHeaderTextColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                onChangeComplete={(color: {hex: string}) => {
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPrimaryColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                onChangeComplete={(color: {hex: string}) => {
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAccentColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                onChangeComplete={(color: {hex: string}) => {
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setBackgroundColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
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
