import React, {createRef} from 'react';
import {Button, Dropdown, Input, ListenOutsideClick, Toggle} from 'components';
import styles from './CustomiseSection.module.scss';
import {SketchPicker} from 'react-color';
import {AiryChatPlugin, AiryChatPluginConfiguration} from 'chat-plugin';
import {env} from '../../../../../../env';
import {getUseLocalState} from '../../../../../../services/hooks/localState';

enum CloseOption {
  basic = 'basic',
  medium = 'medium',
  full = 'full',
}

enum BubbleState {
  minimized = 'minimized',
  expanded = 'expanded',
}

interface CustomiseSectionProps {
  channelId: string;
  host: string;
}

export const CustomiseSection = ({channelId, host}: CustomiseSectionProps) => {
  const useLocalState = getUseLocalState(channelId);
  const [headerText, setHeaderText] = useLocalState('headerText', '');
  const [subtitleText, setSubtitleText] = useLocalState('subTitleText', '');
  const [startNewConversationText, setStartNewConversationText] = useLocalState('startNewConversationText', '');
  const [bubbleIconUrl, setBubbleIconUrl] = useLocalState('bubbleIconUrl', '');
  const [sendMessageIconUrl, setSendMessageIconUrl] = useLocalState('sendMessageIconUrl', '');
  const [headerTextColor, setHeaderTextColor] = useLocalState('headerTextColor', '');
  const [subtitleTextColor, setSubtitleTextColor] = useLocalState('subtitleTextColor', '');
  const [showHeaderTextColorPicker, setShowHeaderTextColorPicker] = useLocalState('showHeaderTextColorPicker', false);
  const [showSubtitleTextColorPicker, setShowSubtitleTextColorPicker] = useLocalState(
    'showSubtitleTextColorPicker',
    false
  );
  const [primaryColor, setPrimaryColor] = useLocalState('primaryColor', '');
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useLocalState('showPrimaryColorPicker', false);
  const [accentColor, setAccentColor] = useLocalState('accentColor', '');
  const [showAccentColorPicker, setShowAccentColorPicker] = useLocalState('showAccentColorPicker', false);
  const [backgroundColor, setBackgroundColor] = useLocalState('backgroundColor', '');
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useLocalState('showBackgroundColorPicker', false);
  const [height, setHeight] = useLocalState('height', '700');
  const [width, setWidth] = useLocalState('width', '350');
  const [disableMobile, setDisableMobile] = useLocalState('disableMobile', false);
  const [hideInputBar, setHideInputBar] = useLocalState('hideInputBar', false);
  const [hideEmojis, setHideEmojis] = useLocalState('hideEmojis', false);
  const [closingOption, setClosingOption] = useLocalState<CloseOption>('closingOption', CloseOption.full);
  const [bubbleState, setBubbleState] = useLocalState<BubbleState>('bubbleState', BubbleState.expanded);

  const codeAreaRef = createRef<HTMLTextAreaElement>();

  const toggleShowHeaderTextColorPicker = () => {
    setShowHeaderTextColorPicker(!showHeaderTextColorPicker);
  };

  const toggleShowSubtitleTextColorPicker = () => {
    setShowSubtitleTextColorPicker(!showSubtitleTextColorPicker);
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

  const formatConfigAttribute = (attribute: string, config: string): string => {
    if (config === '') {
      return '\n           ' + attribute;
    }
    return ',\n           ' + attribute;
  };

  const getTemplateConfig = () => {
    let config = '';
    if (headerText !== '') config += formatConfigAttribute(`headerText: '${headerText}'`, config);
    if (subtitleText !== '') config += formatConfigAttribute(`subtitleText: '${subtitleText}'`, config);
    if (startNewConversationText !== '')
      config += formatConfigAttribute(`startNewConversationText: '${startNewConversationText}'`, config);
    if (bubbleIconUrl !== '') config += formatConfigAttribute(`bubbleIcon: '${bubbleIconUrl}'`, config);
    if (sendMessageIconUrl !== '') config += formatConfigAttribute(`sendMessageIcon: '${sendMessageIconUrl}'`, config);
    if (headerTextColor !== '') config += formatConfigAttribute(`headerTextColor: '${headerTextColor}'`, config);
    if (subtitleTextColor !== '') config += formatConfigAttribute(`subtitleTextColor: '${subtitleTextColor}'`, config);
    if (primaryColor !== '') config += formatConfigAttribute(`primaryColor: '${primaryColor}'`, config);
    if (accentColor !== '') config += formatConfigAttribute(`accentColor: '${accentColor}'`, config);
    if (backgroundColor !== '') config += formatConfigAttribute(`backgroundColor: '${backgroundColor}'`, config);
    if (height !== '') config += formatConfigAttribute(`height: '${height}'`, config);
    if (width !== '') config += formatConfigAttribute(`width: '${width}'`, config);
    config += formatConfigAttribute(`closeMode: '${closingOption}'`, config);
    config += formatConfigAttribute(`bubbleState: '${bubbleState}'`, config);
    config += formatConfigAttribute(`disableMobile: '${disableMobile}'`, config);
    config += formatConfigAttribute(`hideInputBar: '${hideInputBar}'`, config);
    config += formatConfigAttribute(`hideEmojis: '${hideEmojis}'`, config);

    return `w[n].config = {${config}
        };`;
  };

  const demoConfig: AiryChatPluginConfiguration = {
    apiHost: env.API_HOST,
    channelId,
    config: {
      showMode: true,
      ...(headerText && {headerText}),
      ...(subtitleText && {subtitleText}),
      ...(startNewConversationText && {startNewConversationText}),
      ...(headerTextColor && {headerTextColor}),
      ...(subtitleTextColor && {subtitleTextColor}),
      ...(primaryColor && {primaryColor}),
      ...(accentColor && {accentColor}),
      ...(backgroundColor && {backgroundColor}),
      ...(bubbleIconUrl && {bubbleIcon: bubbleIconUrl}),
      ...(sendMessageIconUrl && {sendMessageIcon: sendMessageIconUrl}),
      ...(width && {width: parseInt(width) < 200 ? 350 : parseInt(width)}),
      ...(height && {height: parseInt(height) < 200 ? 700 : parseInt(height)}),
      ...(closingOption && {closeMode: closingOption}),
      ...(bubbleState && {bubbleState: bubbleState}),
      ...(disableMobile && {disableMobile: disableMobile}),
      ...(hideInputBar && {hideInputBar: hideInputBar}),
      ...(hideEmojis && {hideEmojis: hideEmojis}),
    },
  };

  const copyToClipboard = () => {
    codeAreaRef.current?.select();
    document.execCommand('copy');
  };

  const getCode = () =>
    `<script>
        (function(w, d, s, n) {
          w[n] = w[n] || {};
          w[n].channelId = '${channelId}';
          w[n].host = '${host}';
          ${getTemplateConfig()}
          var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s);
          j.async = true;
          j.src = w[n].host + '/chatplugin/ui/s.js';
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'airy');
      </script>`;

  return (
    <>
      <div className={styles.codeAreaContainer}>
        <div className={styles.installHint}>
          Add this code inside the tag <code>&lt;head&gt;</code>:
        </div>
        <div>
          <textarea readOnly className={styles.codeArea} ref={codeAreaRef} value={getCode()} />
        </div>
        <Button onClick={copyToClipboard}>Copy code</Button>
      </div>
      <div className={styles.customiseContainer}>
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
        <p>Subtitle Text Color</p>
        <div className={styles.colorPicker}>
          {showSubtitleTextColorPicker && (
            <ListenOutsideClick className={styles.colorPickerWrapper} onOuterClick={toggleShowSubtitleTextColorPicker}>
              <SketchPicker
                color={subtitleTextColor}
                onChangeComplete={(color: {hex: string}) => {
                  setSubtitleTextColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: subtitleTextColor}}
            onClick={toggleShowSubtitleTextColorPicker}
          />
          <Input
            type="text"
            name="Subtitle Text Color"
            value={subtitleTextColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSubtitleTextColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value !== '') {
                const newSubtitleTextColor = value.startsWith('#') ? value : '#' + value;
                setSubtitleTextColor(newSubtitleTextColor.toUpperCase());
              } else {
                setSubtitleTextColor('');
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
        <div className={styles.extraOptions}>
          <Dropdown
            text={`Closing Options: ${closingOption}`}
            variant="normal"
            options={[CloseOption.basic, CloseOption.medium, CloseOption.full]}
            onClick={(option: CloseOption) => {
              setClosingOption(option);
            }}
          />
        </div>
        <div className={styles.extraOptions}>
          <Dropdown
            text={`Bubble State Options: ${bubbleState}`}
            variant="normal"
            options={[BubbleState.expanded, BubbleState.minimized]}
            onClick={(option: BubbleState) => {
              setBubbleState(option);
            }}
          />
        </div>
        <div className={styles.extraOptions}>
          <Toggle
            value={disableMobile}
            text="Disabled for Mobile"
            updateValue={(value: boolean) => setDisableMobile(value)}
          />
        </div>
        <div className={styles.extraOptions}>
          <Toggle value={hideInputBar} text="Hide Input Bar" updateValue={(value: boolean) => setHideInputBar(value)} />
        </div>
        <div className={styles.extraOptions}>
          <Toggle value={hideEmojis} text="Disable Emojis" updateValue={(value: boolean) => setHideEmojis(value)} />
        </div>
      </div>
      <div className={styles.customiseContainer}>
        <Input
          type="text"
          name="textHeader"
          value={headerText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeaderText(e.target.value)}
          label="Header Text"
          placeholder="(optionally) add a text"
          height={32}
          fontClass="font-base"
          maxLength={30}
        />
        <Input
          type="text"
          name="subtitle"
          value={subtitleText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubtitleText(e.target.value)}
          label="Subtitle Text"
          placeholder="(optionally) add a text"
          height={32}
          fontClass="font-base"
          maxLength={50}
        />
        <Input
          type="text"
          name="startNewConversationText"
          value={startNewConversationText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartNewConversationText(e.target.value)}
          label="Start new Conversation Text"
          placeholder="(optionally) add a text"
          height={32}
          fontClass="font-base"
        />
        <Input
          type="url"
          name="bubbleIconUrl"
          value={bubbleIconUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBubbleIconUrl(e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendMessageIconUrl(e.target.value)}
          label="Input Icon URL"
          placeholder="(optionally) add an image url"
          height={32}
          fontClass="font-base"
          showErrors={false}
        />
        <Input
          type="numeric"
          name="height"
          value={height}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value === '') {
              setHeight('0');
            } else {
              setHeight(e.target.value);
            }
          }}
          onKeyDown={e => {
            let intHeight = parseInt(height);
            if (e.key === 'ArrowUp') {
              intHeight += 1;
              setHeight(intHeight.toString());
              e.preventDefault();
            } else if (e.key === 'ArrowDown') {
              intHeight -= 1;
              setHeight(intHeight.toString());
              e.preventDefault();
            }
          }}
          label="Height (min 200px)"
          placeholder="(optionally) add custom height"
          height={32}
          fontClass="font-base"
          showErrors={false}
        />
        <Input
          type="numeric"
          name="width"
          value={width}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value === '') {
              setWidth('0');
            } else {
              setWidth(e.target.value);
            }
          }}
          onKeyDown={e => {
            let intWidth = parseInt(width);
            if (e.key === 'ArrowUp') {
              intWidth += 1;
              setWidth(intWidth.toString());
              e.preventDefault();
            } else if (e.key === 'ArrowDown') {
              intWidth -= 1;
              setWidth(intWidth.toString());
              e.preventDefault();
            }
          }}
          label="Width (min 200px)"
          placeholder="(optionally) add custom width"
          height={32}
          fontClass="font-base"
          showErrors={false}
        />
      </div>
      <div
        className={styles.pluginWrapper}
        style={{
          ...(width && {width: parseInt(width) < 200 ? 350 : parseInt(width)}),
          ...(height && {height: parseInt(height) < 200 ? 700 : parseInt(height)}),
        }}>
        <div className={styles.pluginContainer}>
          <AiryChatPlugin config={demoConfig} />
        </div>
      </div>
    </>
  );
};
