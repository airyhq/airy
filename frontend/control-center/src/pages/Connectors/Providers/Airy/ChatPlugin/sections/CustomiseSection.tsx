import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {Dropdown, Input, Toggle} from 'components';
import styles from './CustomiseSection.module.scss';
import {AiryChatPlugin, AiryChatPluginConfiguration} from 'chat-plugin';
import {env} from '../../../../../../env';
import {getUseLocalState} from '../../../../../../services/hooks/localState';
import {fetchGoogleFonts} from '../../../../../../api/index';
import {useTranslation} from 'react-i18next';
import {SampleInput} from './SampleInput';
import {ColorPickerSample} from './ColorPickerSample';
import {ModalColorPicker} from './ModalColorPicker';
import {useParams} from 'react-router-dom';
import {BubbleState, ChatpluginConfig, CloseOption, DefaultColors, DefaultConfig, Language} from 'model';
import {isEqual} from 'lodash-es';
import {ColorPicker} from './ColorPicker';

type CustomiseSectionProps = {
  channelId: string;
  host: string;
  setChatpluginConfig: Dispatch<SetStateAction<ChatpluginConfig>>;
};

let CurrentConfig: ChatpluginConfig = {};

export const CustomiseSection = ({channelId, host, setChatpluginConfig}: CustomiseSectionProps) => {
  const {channelIdParams} = useParams();
  const useLocalState = getUseLocalState(channelId || channelIdParams);
  const {t} = useTranslation();
  const [customHost, setCustomHost] = useLocalState('customHost', host);
  const [headerText, setHeaderText] = useLocalState('headerText', DefaultConfig.headerText);
  const [subtitleText, setSubtitleText] = useLocalState('subTitleText', DefaultConfig.subtitleText);
  const [startNewConversationText, setStartNewConversationText] = useLocalState(
    'startNewConversationText',
    DefaultConfig.startNewConversationText
  );
  const [bubbleIcon, setBubbleIcon] = useLocalState('bubbleIcon', DefaultConfig.bubbleIcon);
  const [sendMessageIcon, setSendMessageIcon] = useLocalState('sendMessageIcon', DefaultConfig.sendMessageIcon);
  const [headerTextColor, setHeaderTextColor] = useLocalState('headerTextColor', `${DefaultConfig.headerTextColor}`);
  const [subtitleTextColor, setSubtitleTextColor] = useLocalState(
    'subtitleTextColor',
    `${DefaultColors.subtitleTextColor}`
  );
  const [showHeaderTextColorPicker, setShowHeaderTextColorPicker] = useLocalState('showHeaderTextColorPicker', false);
  const [showSubtitleTextColorPicker, setShowSubtitleTextColorPicker] = useLocalState(
    'showSubtitleTextColorPicker',
    false
  );
  const [primaryColor, setPrimaryColor] = useLocalState('primaryColor', `${DefaultColors.primaryColor}`);
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useLocalState('showPrimaryColorPicker', false);
  const [accentColor, setAccentColor] = useLocalState('accentColor', `${DefaultColors.accentColor}`);
  const [showAccentColorPicker, setShowAccentColorPicker] = useLocalState('showAccentColorPicker', false);

  const [backgroundColor, setBackgroundColor] = useLocalState('backgroundColor', `${DefaultColors.backgroundColor}`);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useLocalState('showBackgroundColorPicker', false);

  const [inboundMessageColor, setInboundMessageColor] = useLocalState(
    'inboundMessageColor',
    `${DefaultColors.inboundMessageColor}`
  );
  const [showInboundMessageColorPicker, setShowInboundMessageColorPicker] = useLocalState(
    'showInboundMessageColorPicker',
    false
  );

  const [inboundMessageTextColor, setInboundMessageTextColor] = useLocalState(
    'inboundMessageTextColor',
    `${DefaultColors.inboundMessageTextColor}`
  );
  const [showInboundMessageTextColorPicker, setShowInboundMessageTextColorPicker] = useLocalState(
    'showInboundMessageTextColorPicker',
    false
  );

  const [outboundMessageColor, setOutboundMessageColor] = useLocalState(
    'outboundMessageColor',
    `${DefaultColors.outboundMessageColor}`
  );
  const [showOutboundMessageColorPicker, setShowOutboundMessageColorPicker] = useLocalState(
    'showOutboundMessageColorPicker',
    false
  );

  const [outboundMessageTextColor, setOutboundMessageTextColor] = useLocalState(
    'outboundMessageTextColor',
    `${DefaultColors.outboundMessageTextColor}`
  );
  const [showOutboundMessageTextColorPicker, setShowOutboundMessageTextColorPicker] = useLocalState(
    'showOutboundMessageTextColorPicker',
    false
  );
  const [unreadMessageDotColor, setUnreadMessageDotColor] = useLocalState(
    'unreadMessageDotColor',
    `${DefaultColors.unreadMessageDotColor}`
  );
  const [showUnreadMessageDotColorPicker, setShowUnreadMessageDotColorPicker] = useLocalState(
    'showUnreadMessageDotColorPicker',
    false
  );

  const [height, setHeight] = useLocalState('height', `${DefaultConfig.height}`);
  const [width, setWidth] = useLocalState('width', `${DefaultConfig.width}`);
  const [disableMobile, setDisableMobile] = useLocalState('disableMobile', DefaultConfig.disableMobile);
  const [hideInputBar, setHideInputBar] = useLocalState('hideInputBar', DefaultConfig.hideInputBar);
  const [hideEmojis, setHideEmojis] = useLocalState('hideEmojis', DefaultConfig.hideEmojis);
  const [hideAttachments, setHideAttachments] = useLocalState('hideAttachments', DefaultConfig.hideAttachments);
  const [hideImages, setHideImages] = useLocalState('hideImages', DefaultConfig.hideImages);
  const [hideVideos, setHideVideos] = useLocalState('hideVideos', DefaultConfig.hideVideos);
  const [hideFiles, setHideFiles] = useLocalState('hideFiles', DefaultConfig.hideFiles);
  const [useCustomFont, setUseCustomFont] = useLocalState('useCustomFont', DefaultConfig.useCustomFont);
  const [customFont, setCustomFont] = useLocalState('customFont', DefaultConfig.customFont);
  const [closeMode, setCloseMode] = useLocalState('closeMode', DefaultConfig.closeMode);
  const [bubbleState, setBubbleState] = useLocalState('bubbleState', DefaultConfig.bubbleState);
  const [colorStepText, setColorStepText] = useLocalState('colorStepText', `${t('headerTextColor')}`);
  const [activeColorStep, setActiveColorStep] = useLocalState('activeColorStep', 0);
  const colorStepsArr = [
    t('headerTextColor'),
    t('subtitleTextColor'),
    t('primaryColor'),
    t('accentColor'),
    t('backgroundColor'),
    t('inboundBackgroundColor'),
    t('inboundMessageTextColor'),
    t('outboundBackgroundColor'),
    t('outboundMessageTextColor'),
    t('unreadMessageDotColor'),
  ];

  const currentLanguage = localStorage.getItem('language');

  const NewConfig: ChatpluginConfig = {
    welcomeMessage: '',
    startNewConversationText: '',
    headerText,
    subtitleText,
    headerTextColor,
    subtitleTextColor,
    primaryColor,
    accentColor,
    backgroundColor,
    inboundMessageColor,
    inboundMessageTextColor,
    outboundMessageColor,
    outboundMessageTextColor,
    unreadMessageDotColor,
    sendMessageIcon,
    showMode: false,
    height,
    width,
    disableMobile,
    bubbleState,
    bubbleIcon,
    closeMode,
    hideInputBar,
    hideEmojis,
    useCustomFont,
    customFont,
    hideAttachments,
    hideImages,
    hideVideos,
    hideFiles,
  };

  const areEqual = isEqual(CurrentConfig, NewConfig);
  const noChanges = isEqual(NewConfig, DefaultConfig) && isEqual(CurrentConfig, DefaultConfig);

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

  const handleColorStepChange = (stepText: string) => {
    switch (stepText) {
      case t('headerTextColor'):
        setActiveColorStep(0);
        setColorStepText(`${t('headerTextColor')}`);
        break;
      case t('subtitleTextColor'):
        setActiveColorStep(1);
        setColorStepText(`${t('subtitleTextColor')}`);
        break;
      case t('primaryColor'):
        setActiveColorStep(2);
        setColorStepText(`${t('primaryColor')}`);
        break;
      case t('accentColor'):
        setActiveColorStep(3);
        setColorStepText(`${t('accentColor')}`);
        break;
      case t('backgroundColor'):
        setActiveColorStep(4);
        setColorStepText(`${t('backgroundColor')}`);
        break;
      case t('inboundBackgroundColor'):
        setActiveColorStep(5);
        setColorStepText(`${t('inboundBackgroundColor')}`);
        break;
      case t('inboundMessageTextColor'):
        setActiveColorStep(6);
        setColorStepText(`${t('inboundMessageTextColor')}`);
        break;
      case t('outboundBackgroundColor'):
        setActiveColorStep(7);
        setColorStepText(`${t('outboundBackgroundColor')}`);
        break;
      case t('outboundMessageTextColor'):
        setActiveColorStep(8);
        setColorStepText(`${t('outboundMessageTextColor')}`);
        break;
      case t('unreadMessageDotColor'):
        setActiveColorStep(9);
        setColorStepText(`${t('unreadMessageDotColor')}`);
        break;
    }
  };

  const handleResetConfig = () => {
    setHeaderText('');
    setHeaderTextColor(DefaultColors.headerTextColor);
    setSubtitleText('');
    setSubtitleTextColor(DefaultColors.subtitleTextColor);
    setPrimaryColor(DefaultColors.primaryColor);
    setAccentColor(DefaultColors.accentColor);
    setBackgroundColor(DefaultColors.backgroundColor);
    setInboundMessageColor(DefaultColors.inboundMessageColor);
    setInboundMessageTextColor(DefaultColors.inboundMessageTextColor);
    setOutboundMessageColor(DefaultColors.outboundMessageColor);
    setOutboundMessageTextColor(DefaultColors.outboundMessageTextColor);
    setUnreadMessageDotColor(DefaultColors.unreadMessageDotColor);
    setHeight('700');
    setWidth('380');
    setDisableMobile(false);
    setBubbleState(BubbleState.expanded);
    setCloseMode(CloseOption.full);
    setHideInputBar(false);
    setHideEmojis(false);
    setUseCustomFont(true);
    setCustomFont('Lato');
    setHideAttachments(false);
    setHideImages(false);
    setHideVideos(false);
    setHideFiles(false);
    setSendMessageIcon('');
    setBubbleIcon('');
  };

  const handleSaveConfig = () => {
    CurrentConfig = NewConfig;
    setChatpluginConfig(NewConfig);
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
      ...(outboundMessageColor && {outboundMessageColor: outboundMessageColor}),
      ...(outboundMessageTextColor && {outboundMessageTextColor}),
      ...(inboundMessageColor && {inboundMessageColor: inboundMessageColor}),
      ...(inboundMessageTextColor && {inboundMessageTextColor}),
      ...(unreadMessageDotColor && {unreadMessageDotColor}),
      ...(bubbleIcon && {bubbleIcon: bubbleIcon}),
      ...(sendMessageIcon && {sendMessageIcon: sendMessageIcon}),
      ...(width && {width: parseInt(width) < 200 ? 380 : parseInt(width)}),
      ...(height && {height: parseInt(height) < 200 ? 700 : parseInt(height)}),
      ...(closeMode && {closeMode: closeMode}),
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
          <div className={styles.buttonContainer}>
            {!noChanges && (
              <>
                {areEqual ? (
                  <button onClick={handleResetConfig}>{t('reset')}</button>
                ) : (
                  <button onClick={handleSaveConfig}>{t('save')}</button>
                )}
              </>
            )}
            <a
              href={`https://staging.airy.co/chatplugin/ui/example?channel_id=${channelId}`}
              target="_blank"
              rel="noreferrer"
            >
              {t('preview')}
            </a>
          </div>
          <h1>{t('chatpluginTitle')}</h1>
          <h2>{t('chatpluginCustomize')}</h2>
        </div>
        <div className={styles.colorContainer}>
          <div className={styles.dropdownInputContainer}>
            <div className={styles.stepTextDropdown}>
              <Dropdown
                text={colorStepText}
                variant="normal"
                options={colorStepsArr}
                onClick={(stepText: string) => {
                  handleColorStepChange(stepText);
                }}
              />
            </div>
            <div className={styles.colorPickerContainer}>
              <div className={styles.headerTextColors}>
                <ColorPicker
                  background={headerTextColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[0])}
                  activeColorStep={activeColorStep}
                  colorStep={0}
                />
                <ColorPicker
                  background={subtitleTextColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[1])}
                  activeColorStep={activeColorStep}
                  colorStep={1}
                />
                <ColorPicker
                  background={primaryColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[2])}
                  activeColorStep={activeColorStep}
                  colorStep={2}
                />
                <ColorPicker
                  background={accentColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[3])}
                  activeColorStep={activeColorStep}
                  colorStep={3}
                />
                <ColorPicker
                  background={backgroundColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[4])}
                  activeColorStep={activeColorStep}
                  colorStep={4}
                />
                <ColorPicker
                  background={inboundMessageColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[5])}
                  activeColorStep={activeColorStep}
                  colorStep={5}
                />
                <ColorPicker
                  background={inboundMessageTextColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[6])}
                  activeColorStep={activeColorStep}
                  colorStep={6}
                />
                <ColorPicker
                  background={outboundMessageColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[7])}
                  activeColorStep={activeColorStep}
                  colorStep={7}
                />
                <ColorPicker
                  background={outboundMessageTextColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[8])}
                  activeColorStep={activeColorStep}
                  colorStep={8}
                />
                <ColorPicker
                  background={unreadMessageDotColor}
                  setColorStep={() => handleColorStepChange(colorStepsArr[9])}
                  activeColorStep={activeColorStep}
                  colorStep={9}
                />
              </div>
              {showHeaderTextColorPicker && (
                <ModalColorPicker
                  color={headerTextColor}
                  setColor={setHeaderTextColor}
                  toggle={toggleShowHeaderTextColorPicker}
                />
              )}
              {showSubtitleTextColorPicker && (
                <ModalColorPicker
                  color={subtitleTextColor}
                  setColor={setSubtitleTextColor}
                  toggle={toggleShowSubtitleTextColorPicker}
                />
              )}
              {showPrimaryColorPicker && (
                <ModalColorPicker
                  color={primaryColor}
                  setColor={setPrimaryColor}
                  toggle={toggleShowPrimaryColorPicker}
                />
              )}
              {showAccentColorPicker && (
                <ModalColorPicker color={accentColor} setColor={setAccentColor} toggle={toggleShowAccentColorPicker} />
              )}
              {showBackgroundColorPicker && (
                <ModalColorPicker
                  color={backgroundColor}
                  setColor={setBackgroundColor}
                  toggle={toggleShowBackgroundColorPicker}
                />
              )}
              {showInboundMessageColorPicker && (
                <ModalColorPicker
                  color={inboundMessageColor}
                  setColor={setInboundMessageColor}
                  toggle={toggleShowInboundMessageColorPicker}
                />
              )}
              {showInboundMessageTextColorPicker && (
                <ModalColorPicker
                  color={inboundMessageTextColor}
                  setColor={setInboundMessageTextColor}
                  toggle={toggleShowInboundMessageTextColorPicker}
                />
              )}
              {showOutboundMessageColorPicker && (
                <ModalColorPicker
                  color={outboundMessageColor}
                  setColor={setOutboundMessageColor}
                  toggle={toggleShowOutboundMessageColorPicker}
                />
              )}
              {showOutboundMessageTextColorPicker && (
                <ModalColorPicker
                  color={outboundMessageTextColor}
                  setColor={setOutboundMessageTextColor}
                  toggle={toggleShowOutboundMessageTextColorPicker}
                />
              )}
              {showUnreadMessageDotColorPicker && (
                <ModalColorPicker
                  color={unreadMessageDotColor}
                  setColor={setUnreadMessageDotColor}
                  toggle={toggleShowUnreadMessageDotColorPicker}
                />
              )}
            </div>
          </div>
          <div className={styles.inputsContainer}>
            <p className={styles.hexTitle}>Hex</p>
            {activeColorStep === 0 && (
              <SampleInput
                value={headerTextColor}
                setValue={setHeaderTextColor}
                name={t('headerTextColor')}
                placeholder={DefaultColors.headerTextColor}
              />
            )}
            {activeColorStep === 1 && (
              <SampleInput
                value={subtitleTextColor}
                setValue={setSubtitleTextColor}
                name={t('subtitleTextColor')}
                placeholder={DefaultColors.subtitleTextColor}
              />
            )}
            {activeColorStep === 2 && (
              <SampleInput
                value={primaryColor}
                setValue={setPrimaryColor}
                name={t('primaryColor')}
                placeholder={DefaultColors.primaryColor}
              />
            )}
            {activeColorStep === 3 && (
              <SampleInput
                value={accentColor}
                setValue={setAccentColor}
                name={t('accentColor')}
                placeholder={DefaultColors.accentColor}
              />
            )}
            {activeColorStep === 4 && (
              <SampleInput
                value={backgroundColor}
                setValue={setBackgroundColor}
                name={t('backgroundColor')}
                placeholder={DefaultColors.backgroundColor}
              />
            )}
            {activeColorStep === 5 && (
              <SampleInput
                value={inboundMessageColor}
                setValue={setInboundMessageColor}
                name={t('inboundMessageColor')}
                placeholder={DefaultColors.inboundMessageColor}
              />
            )}
            {activeColorStep === 6 && (
              <SampleInput
                value={inboundMessageTextColor}
                setValue={setInboundMessageTextColor}
                name={t('inboundMessageTextColor')}
                placeholder={DefaultColors.inboundMessageTextColor}
              />
            )}
            {activeColorStep === 7 && (
              <SampleInput
                value={outboundMessageColor}
                setValue={setOutboundMessageColor}
                name={t('outboundMessageBackgroundColor')}
                placeholder={DefaultColors.outboundMessageColor}
              />
            )}
            {activeColorStep === 8 && (
              <SampleInput
                value={outboundMessageTextColor}
                setValue={setOutboundMessageTextColor}
                name={t('outboundMessageTextColor')}
                placeholder={DefaultColors.outboundMessageTextColor}
              />
            )}
            {activeColorStep === 9 && (
              <SampleInput
                value={unreadMessageDotColor}
                setValue={setUnreadMessageDotColor}
                name={t('unreadMessageDotColor')}
                placeholder={DefaultColors.unreadMessageDotColor}
              />
            )}
          </div>
          <div className={styles.colorSample}>
            <p className={styles.sampleTitle}>Sample</p>
            {activeColorStep === 0 && (
              <ColorPickerSample value={headerTextColor} toggle={toggleShowHeaderTextColorPicker} />
            )}
            {activeColorStep === 1 && (
              <ColorPickerSample value={subtitleTextColor} toggle={toggleShowSubtitleTextColorPicker} />
            )}
            {activeColorStep === 2 && <ColorPickerSample value={primaryColor} toggle={toggleShowPrimaryColorPicker} />}
            {activeColorStep === 3 && <ColorPickerSample value={accentColor} toggle={toggleShowAccentColorPicker} />}
            {activeColorStep === 4 && (
              <ColorPickerSample value={backgroundColor} toggle={toggleShowBackgroundColorPicker} />
            )}
            {activeColorStep === 5 && (
              <ColorPickerSample value={inboundMessageColor} toggle={toggleShowInboundMessageColorPicker} />
            )}
            {activeColorStep === 6 && (
              <ColorPickerSample value={inboundMessageTextColor} toggle={toggleShowInboundMessageTextColorPicker} />
            )}
            {activeColorStep === 7 && (
              <ColorPickerSample value={outboundMessageColor} toggle={toggleShowOutboundMessageColorPicker} />
            )}
            {activeColorStep === 8 && (
              <ColorPickerSample value={outboundMessageTextColor} toggle={toggleShowOutboundMessageTextColorPicker} />
            )}
            {activeColorStep === 9 && (
              <ColorPickerSample value={unreadMessageDotColor} toggle={toggleShowUnreadMessageDotColorPicker} />
            )}
          </div>
        </div>
      </div>
      <div className={styles.borderLine} />
      <div className={styles.customiseContainer}>
        <div className={styles.customiseContainerInputs}>
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
            minWidth={currentLanguage !== Language.english && 350}
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
            minWidth={currentLanguage !== Language.english && 350}
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
            minWidth={currentLanguage !== Language.english && 350}
          />
          <Input
            type="url"
            name="bubbleIcon"
            value={bubbleIcon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBubbleIcon(e.target.value)}
            label={t('chatpluginIconUrl')}
            placeholder={t('addImageurlOptional')}
            height={32}
            fontClass="font-base"
            showErrors={false}
            minWidth={currentLanguage !== Language.english && 350}
          />
          <Input
            type="text"
            name="sendMessageIcon"
            value={sendMessageIcon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendMessageIcon(e.target.value)}
            label={t('inputIconUrl')}
            placeholder={t('addImageurlOptional')}
            height={32}
            fontClass="font-base"
            showErrors={false}
            minWidth={currentLanguage !== Language.english && 350}
          />
          <Input
            type="text"
            name="customHost"
            value={customHost}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomHost(e.target.value)}
            label={t('customHostUrl')}
            placeholder="http://airy.core"
            required={true}
            height={32}
            fontClass="font-base"
            showErrors={false}
            minWidth={currentLanguage !== Language.english && 350}
          />
          <Input
            type="numeric"
            name="height"
            value={height}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value === '') {
                setHeight('700');
              }
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setHeight(e.target.value);
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
            minWidth={currentLanguage !== Language.english && 350}
          />
          <Input
            type="numeric"
            name="width"
            value={width}
            onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value === '') {
                setWidth('380');
              }
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setWidth(e.target.value);
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
            minWidth={currentLanguage !== Language.english && 350}
          />
        </div>
        <div className={styles.borderLine} />
        <div
          className={styles.customiseContainerToggles}
          style={
            currentLanguage === Language.french || currentLanguage === Language.spanish
              ? {minWidth: '340px'}
              : {minWidth: '300px'}
          }
        >
          <div className={styles.extraOptions}>
            <Toggle
              value={disableMobile}
              text={t('disabledForMobile')}
              updateValue={(value: boolean) => setDisableMobile(value)}
              minWidth={(currentLanguage === Language.german || currentLanguage === Language.french) && 350}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle
              value={hideInputBar}
              text={t('hideInputbar')}
              updateValue={(value: boolean) => setHideInputBar(value)}
              minWidth={(currentLanguage === Language.german || currentLanguage === Language.french) && 350}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle
              value={hideEmojis}
              text={t('disableEmojis')}
              updateValue={(value: boolean) => setHideEmojis(value)}
              minWidth={(currentLanguage === Language.german || currentLanguage === Language.french) && 350}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle
              value={useCustomFont}
              text={t('useCustomFont')}
              updateValue={(value: boolean) => setUseCustomFont(value)}
              minWidth={(currentLanguage === Language.german || currentLanguage === Language.french) && 350}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle
              value={hideImages}
              text={t('disableImages')}
              updateValue={(value: boolean) => setHideImages(value)}
              minWidth={(currentLanguage === Language.german || currentLanguage === Language.french) && 350}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle
              value={hideVideos}
              text={t('disableVideos')}
              updateValue={(value: boolean) => setHideVideos(value)}
              minWidth={(currentLanguage === Language.german || currentLanguage === Language.french) && 350}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle
              value={hideFiles}
              text={t('disableFiles')}
              updateValue={(value: boolean) => setHideFiles(value)}
              minWidth={(currentLanguage === Language.german || currentLanguage === Language.french) && 350}
            />
          </div>
        </div>
      </div>
      <div className={styles.borderLine} />
      <div className={styles.customiseContainerDropdowns}>
        {useCustomFont && (
          <div className={styles.extraOptions}>
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
            text={`${t('closingOptions')}: ${closeMode}`}
            variant="normal"
            options={[CloseOption.basic, CloseOption.medium, CloseOption.full]}
            onClick={(option: CloseOption) => {
              setCloseMode(option);
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
      <div
        className={styles.pluginWrapper}
        style={{
          ...(width && {width: parseInt(width) < 200 ? 350 : parseInt(width)}),
          ...(height && {height: parseInt(height) < 200 ? 700 : parseInt(height)}),
        }}
      >
        <div className={styles.pluginContainer}>
          <AiryChatPlugin
            config={demoConfig}
            bubbleState={colorStepText === t('unreadMessageDotColor') ? BubbleState.minimized : BubbleState.expanded}
          />
        </div>
      </div>
    </>
  );
};
