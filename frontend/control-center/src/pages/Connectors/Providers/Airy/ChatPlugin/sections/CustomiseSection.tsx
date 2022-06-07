import React, {createRef, useEffect, useState} from 'react';
import {Button, Dropdown, ErrorNotice, Input, ListenOutsideClick, Toggle} from 'components';
import styles from './CustomiseSection.module.scss';
import {SketchPicker} from 'react-color';
import {AiryChatPlugin, AiryChatPluginConfiguration} from 'chat-plugin';
import {env} from '../../../../../../env';
import {getUseLocalState} from '../../../../../../services/hooks/localState';
import {fetchGoogleFonts} from '../../../../../../api/index';
import {useTranslation} from 'react-i18next';
import {ColorPicker} from './HeaderTextColorPicker';

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
  const {t} = useTranslation();
  const [customHost, setCustomHost] = useLocalState('customHost', host);
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

  const [inboundMessageBackgroundColor, setInboundMessageBackgroundColor] = useLocalState(
    'inboundMessageBackgroundColor',
    ''
  );
  const [showInboundMessageColorPicker, setShowInboundMessageColorPicker] = useLocalState(
    'showInboundMessageColorPicker',
    false
  );

  const [inboundMessageTextColor, setInboundMessageTextColor] = useLocalState('inboundMessageTextColor', '');
  const [showInboundMessageTextColorPicker, setShowInboundMessageTextColorPicker] = useLocalState(
    'showInboundMessageTextColorPicker',
    false
  );

  const [outboundMessageBackgroundColor, setOutboundMessageBackgroundColor] = useLocalState(
    'outboundMessageBackgroundColor',
    ''
  );
  const [showOutboundMessageColorPicker, setShowOutboundMessageColorPicker] = useLocalState(
    'showOutboundMessageColorPicker',
    false
  );

  const [outboundMessageTextColor, setOutboundMessageTextColor] = useLocalState('outboundMessageTextColor', '');
  const [showOutboundMessageTextColorPicker, setShowOutboundMessageTextColorPicker] = useLocalState(
    'showOutboundMessageTextColorPicker',
    false
  );
  const [unreadMessageDotColor, setUnreadMessageDotColor] = useLocalState('unreadMessageDotColor', '');
  const [showUnreadMessageDotColorPicker, setShowUnreadMessageDotColorPicker] = useLocalState(
    'showUnreadMessageDotColorPicker',
    false
  );

  const [height, setHeight] = useLocalState('height', '700');
  const [width, setWidth] = useLocalState('width', '350');
  const [disableMobile, setDisableMobile] = useLocalState('disableMobile', false);
  const [hideInputBar, setHideInputBar] = useLocalState('hideInputBar', false);
  const [hideEmojis, setHideEmojis] = useLocalState('hideEmojis', false);
  const [hideAttachments, setHideAttachments] = useLocalState('hideAttachments', false);
  const [hideImages, setHideImages] = useLocalState('hideImages', false);
  const [hideVideos, setHideVideos] = useLocalState('hideVideos', false);
  const [hideFiles, setHideFiles] = useLocalState('hideFiles', false);
  const [useCustomFont, setUseCustomFont] = useLocalState('useCustomFont', true);
  const [customFont, setCustomFont] = useLocalState('customFont', 'Lato');
  const [closingOption, setClosingOption] = useLocalState<CloseOption>('closingOption', CloseOption.full);
  const [bubbleState, setBubbleState] = useLocalState<BubbleState>('bubbleState', BubbleState.expanded);
  const [colorStepText, setColorStepText] = useLocalState<string>('', `${t('headTextColor')}`);
  const [hexColor, setHexColor] = useLocalState<string>('', subtitleTextColor);
  const [activeColorStep, setActiveColorStep] = useState(0);

  const codeAreaRef = createRef<HTMLTextAreaElement>();

  useEffect(() => {
    hideImages && hideVideos && hideFiles ? setHideAttachments(true) : setHideAttachments(false);
  }, [hideImages, hideVideos, hideFiles]);

  useEffect(() => {
    useCustomFont ? setCustomFont(customFont) : setCustomFont('Arial');
    useCustomFont && customFont === 'Arial' && setCustomFont('Lato');
  }, [useCustomFont]);

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

  const toggleShowInboundMessageColorPicker = () => {
    setShowInboundMessageColorPicker(!showInboundMessageColorPicker);
  };

  const toggleShowInboundMessageTextColorPicker = () => {
    setShowInboundMessageTextColorPicker(!showInboundMessageTextColorPicker);
  };

  const toggleShowOutboundMessageColorPicker = () => {
    setShowOutboundMessageColorPicker(!showOutboundMessageColorPicker);
  };

  const toggleShowOutboundMessageTextColorPicker = () => {
    setShowOutboundMessageTextColorPicker(!showOutboundMessageTextColorPicker);
  };
  const toggleShowUnreadMessageDotColorPicker = () => {
    setShowUnreadMessageDotColorPicker(!showUnreadMessageDotColorPicker);
  };

  const [headerTextColorPickerColor, setHeaderTextColorPickerColor] = useState('');

  const handleColorStepChange = (step: number) => {
    switch (step) {
      case 0:
        setActiveColorStep(0);
        setColorStepText(`${t('headTextColor')}`);
        break;
      case 1:
        setActiveColorStep(1);
        setColorStepText(`${t('subtitleTextColor')}`);
        break;
      case 2:
        setActiveColorStep(2);
        setColorStepText(`${t('primaryColor')}`);
        break;
      case 3:
        setActiveColorStep(3);
        setColorStepText(`${t('accentColor')}`);
        break;
      case 4:
        setActiveColorStep(4);
        setColorStepText(`${t('backgroundColor')}`);
        break;
      case 5:
        setActiveColorStep(5);
        setColorStepText(`${t('inboundBackgroundColor')}`);
        break;
      case 6:
        setActiveColorStep(6);
        setColorStepText(`${t('outboundBackgroundColor')}`);
        break;
    }
  };

  const HeaderTextColorPicker = () => {
    return (
      <div className={styles.headerTextColors}>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(0)}
          style={{background: headerTextColor}}>
          {activeColorStep === 0 && (
            <>
              <div className={styles.activeColorStep} />
              <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                <div
                  className={styles.colorPickerSample}
                  style={{backgroundColor: headerTextColor}}
                  onClick={toggleShowHeaderTextColorPicker}
                />
              </div>
            </>
          )}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(1)}
          style={{background: subtitleTextColor}}>
          {activeColorStep === 1 && (
            <>
              <div className={styles.activeColorStep} />
              <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                <div
                  className={styles.colorPickerSample}
                  style={{backgroundColor: subtitleTextColor}}
                  onClick={toggleShowSubtitleTextColorPicker}
                />
              </div>
            </>
          )}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(2)}
          style={{background: primaryColor}}>
          {activeColorStep === 2 && (
            <>
              <div className={styles.activeColorStep} />
              <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                <div
                  className={styles.colorPickerSample}
                  style={{backgroundColor: primaryColor}}
                  onClick={toggleShowPrimaryColorPicker}
                />
              </div>
            </>
          )}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(3)}
          style={{background: accentColor}}>
          {activeColorStep === 3 && (
            <>
              <div className={styles.activeColorStep} />
              <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                <div
                  className={styles.colorPickerSample}
                  style={{backgroundColor: accentColor}}
                  onClick={toggleShowAccentColorPicker}
                />
              </div>
            </>
          )}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(4)}
          style={{background: backgroundColor}}>
          {activeColorStep === 4 && (
            <>
              <div className={styles.activeColorStep} />
              <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                <div
                  className={styles.colorPickerSample}
                  style={{backgroundColor: backgroundColor}}
                  onClick={toggleShowBackgroundColorPicker}
                />
              </div>
            </>
          )}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(5)}
          style={{background: inboundMessageBackgroundColor}}>
          {activeColorStep === 5 && (
            <>
              <div className={styles.activeColorStep} />
              <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                <div
                  className={styles.colorPickerSample}
                  style={{backgroundColor: inboundMessageBackgroundColor}}
                  onClick={toggleShowInboundMessageColorPicker}
                />
              </div>
            </>
          )}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(6)}
          style={{background: outboundMessageBackgroundColor}}>
          {activeColorStep === 6 && (
            <>
              <div className={styles.activeColorStep} />
              <div style={{position: 'absolute', left: '760px', top: '410px'}}>
                <div
                  className={styles.colorPickerSample}
                  style={{backgroundColor: outboundMessageBackgroundColor}}
                  onClick={toggleShowOutboundMessageColorPicker}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
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
      ...(outboundMessageBackgroundColor && {outboundMessageColor: outboundMessageBackgroundColor}),
      ...(outboundMessageTextColor && {outboundMessageTextColor}),
      ...(inboundMessageBackgroundColor && {inboundMessageColor: inboundMessageBackgroundColor}),
      ...(inboundMessageTextColor && {inboundMessageTextColor}),
      ...(unreadMessageDotColor && {unreadMessageDotColor}),
      ...(bubbleIconUrl && {bubbleIcon: bubbleIconUrl}),
      ...(sendMessageIconUrl && {sendMessageIcon: sendMessageIconUrl}),
      ...(width && {width: parseInt(width) < 200 ? 350 : parseInt(width)}),
      ...(height && {height: parseInt(height) < 200 ? 700 : parseInt(height)}),
      ...(closingOption && {closeMode: closingOption}),
      ...(bubbleState && {bubbleState: bubbleState}),
      ...(disableMobile && {disableMobile: disableMobile}),
      ...(hideInputBar && {hideInputBar: hideInputBar}),
      ...(hideEmojis && {hideEmojis: hideEmojis}),
      ...(useCustomFont && {useCustomFont: useCustomFont}),
      ...(customFont && {customFont: customFont}),
      ...(hideAttachments && {hideAttachments: hideAttachments}),
      ...(hideImages && {hideImages: hideImages}),
      ...(hideVideos && {hideVideos: hideVideos}),
      ...(hideFiles && {hideFiles: hideFiles}),
    },
  };

  return (
    <>
      <div className={styles.customiseContainer}>
        <div className={styles.titleContainer}>
          <h1>{t('chatpluginTitle')}</h1>
          <span>{t('chatpluginCustomize')}</span>
        </div>
        <div style={{display: 'flex'}}>
          {/* <HeaderTextColorPicker /> */}
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p>{colorStepText}</p>
            <div style={{display: 'flex', alignItems: 'center'}}>
              {/* <ColorPicker /> */}
              <HeaderTextColorPicker />
              {showHeaderTextColorPicker && (
                <ListenOutsideClick
                  className={styles.colorPickerWrapper}
                  onOuterClick={toggleShowHeaderTextColorPicker}>
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
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p>Hex</p>
            <Input
              type="text"
              name={t('headerTextColor')}
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
        </div>
        {/* <p>{t('subtitleTextColor')}</p>
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
            name={t('subtitleTextColor')}
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
        <p>{t('primaryColor')}</p>
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
            name={t('primaryColor')}
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
        <p>{t('accentColor')}</p>
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
            name={t('accentColor')}
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
        <p>{t('backgroundColor')}</p>
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
            name={t('backgroundColor')}
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
        <p>{t('inboundBackgroundColor')}</p>
        <div className={styles.colorPicker}>
          {showInboundMessageColorPicker && (
            <ListenOutsideClick
              className={styles.colorPickerWrapper}
              onOuterClick={toggleShowInboundMessageColorPicker}>
              <SketchPicker
                color={inboundMessageBackgroundColor}
                onChangeComplete={(color: {hex: string}) => {
                  setInboundMessageBackgroundColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: inboundMessageBackgroundColor}}
            onClick={toggleShowInboundMessageColorPicker}
          />
          <Input
            type="text"
            name={t('backgroundColor')}
            value={inboundMessageBackgroundColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInboundMessageBackgroundColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value !== '') {
                const newBackgroundColor = value.startsWith('#') ? value : '#' + value;
                setInboundMessageBackgroundColor(newBackgroundColor.toUpperCase());
              } else {
                setInboundMessageBackgroundColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div>
        <p>{t('inboundTextColor')}</p>
        <div className={styles.colorPicker}>
          {showInboundMessageTextColorPicker && (
            <ListenOutsideClick
              className={styles.colorPickerWrapper}
              onOuterClick={toggleShowInboundMessageTextColorPicker}>
              <SketchPicker
                color={inboundMessageTextColor}
                onChangeComplete={(color: {hex: string}) => {
                  setInboundMessageTextColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: inboundMessageTextColor}}
            onClick={toggleShowInboundMessageTextColorPicker}
          />
          <Input
            type="text"
            name={t('backgroundColor')}
            value={inboundMessageTextColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInboundMessageTextColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value !== '') {
                const newBackgroundColor = value.startsWith('#') ? value : '#' + value;
                setInboundMessageTextColor(newBackgroundColor.toUpperCase());
              } else {
                setInboundMessageTextColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div>
        <p>{t('outboundBackgroundColor')}</p>
        <div className={styles.colorPicker}>
          {showOutboundMessageColorPicker && (
            <ListenOutsideClick
              className={styles.colorPickerWrapper}
              onOuterClick={toggleShowOutboundMessageColorPicker}>
              <SketchPicker
                color={outboundMessageBackgroundColor}
                onChangeComplete={(color: {hex: string}) => {
                  setOutboundMessageBackgroundColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: outboundMessageBackgroundColor}}
            onClick={toggleShowOutboundMessageColorPicker}
          />
          <Input
            type="text"
            name={t('backgroundColor')}
            value={outboundMessageBackgroundColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setOutboundMessageBackgroundColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value !== '') {
                const newBackgroundColor = value.startsWith('#') ? value : '#' + value;
                setOutboundMessageBackgroundColor(newBackgroundColor.toUpperCase());
              } else {
                setOutboundMessageBackgroundColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div>
        <p>{t('outboundTextColor')}</p>
        <div className={styles.colorPicker}>
          {showOutboundMessageTextColorPicker && (
            <ListenOutsideClick
              className={styles.colorPickerWrapper}
              onOuterClick={toggleShowOutboundMessageTextColorPicker}>
              <SketchPicker
                color={outboundMessageTextColor}
                onChangeComplete={(color: {hex: string}) => {
                  setOutboundMessageTextColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: outboundMessageTextColor}}
            onClick={toggleShowOutboundMessageTextColorPicker}
          />
          <Input
            type="text"
            name={t('backgroundColor')}
            value={outboundMessageTextColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setOutboundMessageTextColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value !== '') {
                const newBackgroundColor = value.startsWith('#') ? value : '#' + value;
                setOutboundMessageTextColor(newBackgroundColor.toUpperCase());
              } else {
                setOutboundMessageTextColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div>
        <p>{t('unreadMessageDotColor')}</p>
        <div className={styles.colorPicker}>
          {showUnreadMessageDotColorPicker && (
            <ListenOutsideClick
              className={styles.colorPickerWrapper}
              onOuterClick={toggleShowUnreadMessageDotColorPicker}>
              <SketchPicker
                color={unreadMessageDotColor}
                onChangeComplete={(color: {hex: string}) => {
                  setUnreadMessageDotColor(color.hex.toUpperCase());
                }}
              />
            </ListenOutsideClick>
          )}
          <div
            className={styles.colorPickerSample}
            style={{backgroundColor: unreadMessageDotColor || 'red'}}
            onClick={toggleShowUnreadMessageDotColorPicker}
          />
          <Input
            type="text"
            name={t('backgroundColor')}
            value={unreadMessageDotColor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUnreadMessageDotColor(e.target.value);
            }}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value !== '') {
                const newBackgroundColor = value.startsWith('#') ? value : '#' + value;
                setUnreadMessageDotColor(newBackgroundColor.toUpperCase());
              } else {
                setUnreadMessageDotColor('');
              }
            }}
            placeholder="#FFFFFF"
            height={32}
            fontClass="font-base"
          />
        </div> */}
      </div>
      <div className={styles.customiseContainer}>
        <Input
          type="text"
          name="textHeader"
          value={headerText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeaderText(e.target.value)}
          label={t('headerText')}
          placeholder={t('addTextOptional')}
          height={32}
          fontClass="font-base"
          maxLength={30}
        />
        <Input
          type="text"
          name="subtitle"
          value={subtitleText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubtitleText(e.target.value)}
          label={t('subtitleText')}
          placeholder={t('addTextOptional')}
          height={32}
          fontClass="font-base"
          maxLength={50}
        />
        <Input
          type="text"
          name="startNewConversationText"
          value={startNewConversationText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartNewConversationText(e.target.value)}
          label={t('startNewConversationText')}
          placeholder={t('addTextOptional')}
          height={32}
          fontClass="font-base"
        />
        <Input
          type="url"
          name="bubbleIconUrl"
          value={bubbleIconUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBubbleIconUrl(e.target.value)}
          label={t('chatpluginIconUrl')}
          placeholder={t('addImageurlOptional')}
          height={32}
          fontClass="font-base"
          showErrors={false}
        />
        <Input
          type="text"
          name="sendMessageIconUrl"
          value={sendMessageIconUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendMessageIconUrl(e.target.value)}
          label={t('inputIconUrl')}
          placeholder={t('addImageurlOptional')}
          height={32}
          fontClass="font-base"
          showErrors={false}
        />
        <Input
          type="text"
          name="customHostUrl"
          value={customHost}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomHost(e.target.value)}
          label={t('customHostUrl')}
          placeholder="http://airy.core"
          required={true}
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
          label={t('heightPx')}
          placeholder={t('customHeightPlaceholder')}
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
          label={t('widthPx')}
          placeholder={t('customWidthPlaceholder')}
          height={32}
          fontClass="font-base"
          showErrors={false}
        />
        <div className={styles.extraOptions}>
          <Toggle
            value={disableMobile}
            text={t('disabledForMobile')}
            updateValue={(value: boolean) => setDisableMobile(value)}
          />
        </div>
        <div className={styles.extraOptions}>
          <Toggle
            value={hideInputBar}
            text={t('hideInputbar')}
            updateValue={(value: boolean) => setHideInputBar(value)}
          />
        </div>
        <div className={styles.extraOptions}>
          <Toggle value={hideEmojis} text={t('disableEmojis')} updateValue={(value: boolean) => setHideEmojis(value)} />
        </div>
        <div className={styles.extraOptions}>
          <Toggle
            value={useCustomFont}
            text={t('useCustomFont')}
            updateValue={(value: boolean) => setUseCustomFont(value)}
          />
        </div>
        <div>
          <p>{t('supportedFileTypes')}</p>
          <div className={styles.extraOptions}>
            <Toggle
              value={hideImages}
              text={t('disableImages')}
              updateValue={(value: boolean) => setHideImages(value)}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle
              value={hideVideos}
              text={t('disableVideos')}
              updateValue={(value: boolean) => setHideVideos(value)}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle value={hideFiles} text={t('disableFiles')} updateValue={(value: boolean) => setHideFiles(value)} />
          </div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
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
        {useCustomFont && (
          <div className={styles.fontDropdownContainer}>
            <Dropdown
              text={`${t('customFont')}${customFont}`}
              variant="normal"
              options={fetchGoogleFonts()}
              onClick={(font: string) => {
                setCustomFont(font);
              }}
            />
          </div>
        )}
        <div className={styles.extraOptions}>
          <Dropdown
            text={`${t('closingOptions')}: ${closingOption}`}
            variant="normal"
            options={[CloseOption.basic, CloseOption.medium, CloseOption.full]}
            onClick={(option: CloseOption) => {
              setClosingOption(option);
            }}
          />
        </div>
        <div className={styles.extraOptions}>
          <Dropdown
            text={`${t('bubbleStateOptions')}: ${bubbleState}`}
            variant="normal"
            options={[BubbleState.expanded, BubbleState.minimized]}
            onClick={(option: BubbleState) => {
              setBubbleState(option);
            }}
          />
        </div>
      </div>
    </>
  );
};
