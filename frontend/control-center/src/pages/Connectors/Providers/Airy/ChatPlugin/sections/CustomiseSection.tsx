import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Dropdown, Input, Toggle} from 'components';
import styles from './CustomiseSection.module.scss';
import {AiryChatPlugin, AiryChatPluginConfiguration} from 'chat-plugin';
import {env} from '../../../../../../env';
import {getUseLocalState} from '../../../../../../services/hooks/localState';
import {fetchGoogleFonts} from '../../../../../../api/index';
import {useTranslation} from 'react-i18next';
import {SampleInput} from './SampleInput';
import {ColorPickerSample} from './ColorPickerSample';
import {ChatpluginConfig} from './InstallSection';
import {ModalColorPicker} from './ModalColorPicker';

export enum CloseOption {
  basic = 'basic',
  medium = 'medium',
  full = 'full',
}

export enum BubbleState {
  minimized = 'minimized',
  expanded = 'expanded',
}

export enum DefaultColors {
  headerTextColor = '#FFFFFF',
  subtitleTextColor = '#FFFFFF',
  primaryColor = '#1578D4',
  accentColor = '#1578D4',
  backgroundColor = '#FFFFFF',
  inboundMessageBackgroundColor = '#F1FAFF',
  inboundMessageTextColor = '#000000',
  outboundMessageBackgroundColor = '#1578D4',
  outboundMessageTextColor = '#FFFFFF',
  unreadMessageDotColor = '#FF0000',
}

type CustomiseSectionProps = {
  channelId: string;
  host: string;
  setChatpluginConfig: Dispatch<SetStateAction<ChatpluginConfig>>;
};

export const CustomiseSection = ({channelId, host, setChatpluginConfig}: CustomiseSectionProps) => {
  const useLocalState = getUseLocalState(channelId);
  const {t} = useTranslation();
  const [customHost, setCustomHost] = useLocalState('customHost', host);
  const [headerText, setHeaderText] = useLocalState('headerText', '');
  const [subtitleText, setSubtitleText] = useLocalState('subTitleText', '');
  const [startNewConversationText, setStartNewConversationText] = useLocalState('startNewConversationText', '');
  const [bubbleIconUrl, setBubbleIconUrl] = useLocalState('bubbleIconUrl', '');
  const [sendMessageIconUrl, setSendMessageIconUrl] = useLocalState('sendMessageIconUrl', '');
  const [headerTextColor, setHeaderTextColor] = useLocalState('headerTextColor', `${DefaultColors.headerTextColor}`);
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

  const [inboundMessageBackgroundColor, setInboundMessageBackgroundColor] = useLocalState(
    'inboundMessageBackgroundColor',
    `${DefaultColors.inboundMessageBackgroundColor}`
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

  const [outboundMessageBackgroundColor, setOutboundMessageBackgroundColor] = useLocalState(
    'outboundMessageBackgroundColor',
    `${DefaultColors.outboundMessageBackgroundColor}`
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

  const [height, setHeight] = useLocalState('height', '700');
  const [width, setWidth] = useLocalState('width', '380');
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
  const [colorStepText, setColorStepText] = useState(`${t('headerTextColor')}`);
  const [activeColorStep, setActiveColorStep] = useState(0);
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

  useEffect(() => {
    hideImages && hideVideos && hideFiles ? setHideAttachments(true) : setHideAttachments(false);
  }, [hideImages, hideVideos, hideFiles]);

  useEffect(() => {
    useCustomFont ? setCustomFont(customFont) : setCustomFont('Arial');
    useCustomFont && customFont === 'Arial' && setCustomFont('Lato');
  }, [useCustomFont]);

  // useEffect(() => {
  //   console.log('crazy');

  //   setChatpluginConfig({
  //     headerText,
  //     subtitleText,
  //     startNewConversationText,
  //     bubbleIconUrl,
  //     sendMessageIconUrl,
  //     headerTextColor,
  //     subtitleTextColor,
  //     primaryColor,
  //     accentColor,
  //     backgroundColor,
  //     inboundMessageBackgroundColor,
  //     inboundMessageTextColor,
  //     outboundMessageBackgroundColor,
  //     outboundMessageTextColor,
  //     unreadMessageDotColor,
  //     height,
  //     width,
  //     closingOption,
  //     bubbleState,
  //     disableMobile,
  //     hideInputBar,
  //     hideEmojis,
  //     useCustomFont,
  //     customFont,
  //     hideAttachments,
  //     hideImages,
  //     hideVideos,
  //     hideFiles,
  //   });
  // }, [hideFiles]);

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

  const HeaderTextColorPicker = () => {
    return (
      <div className={styles.headerTextColors}>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('headerTextColor'))}
          style={{background: headerTextColor}}
        >
          {activeColorStep === 0 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('subtitleTextColor'))}
          style={{background: subtitleTextColor}}
        >
          {activeColorStep === 1 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('primaryColor'))}
          style={{background: primaryColor}}
        >
          {activeColorStep === 2 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('accentColor'))}
          style={{background: accentColor}}
        >
          {activeColorStep === 3 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('backgroundColor'))}
          style={{background: backgroundColor}}
        >
          {activeColorStep === 4 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('inboundBackgroundColor'))}
          style={{background: inboundMessageBackgroundColor}}
        >
          {activeColorStep === 5 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('inboundMessageTextColor'))}
          style={{background: inboundMessageTextColor}}
        >
          {activeColorStep === 6 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('outboundBackgroundColor'))}
          style={{background: outboundMessageBackgroundColor}}
        >
          {activeColorStep === 7 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('outboundMessageTextColor'))}
          style={{background: outboundMessageTextColor}}
        >
          {activeColorStep === 8 && <div className={styles.activeColorStep} />}
        </div>
        <div
          className={styles.inactiveColorStep}
          onClick={() => handleColorStepChange(t('unreadMessageDotColor'))}
          style={{background: unreadMessageDotColor}}
        >
          {activeColorStep === 9 && <div className={styles.activeColorStep} />}
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
      ...(width && {width: parseInt(width) < 200 ? 380 : parseInt(width)}),
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
          <h2>{t('chatpluginCustomize')}</h2>
        </div>
        <div style={{display: 'flex'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
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
            <div style={{display: 'flex', alignItems: 'center'}}>
              <HeaderTextColorPicker />
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
                  color={inboundMessageBackgroundColor}
                  setColor={setInboundMessageBackgroundColor}
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
                  color={outboundMessageBackgroundColor}
                  setColor={setOutboundMessageBackgroundColor}
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
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p style={{marginBottom: '5px', marginTop: '6px'}}>Hex</p>
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
                value={inboundMessageBackgroundColor}
                setValue={setInboundMessageBackgroundColor}
                name={t('inboundMessageBackgroundColor')}
                placeholder={DefaultColors.inboundMessageBackgroundColor}
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
                value={outboundMessageBackgroundColor}
                setValue={setOutboundMessageBackgroundColor}
                name={t('outboundMessageBackgroundColor')}
                placeholder={DefaultColors.outboundMessageBackgroundColor}
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
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p style={{marginBottom: '12px', marginTop: '6px'}}>Sample</p>
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
              <ColorPickerSample value={inboundMessageBackgroundColor} toggle={toggleShowInboundMessageColorPicker} />
            )}
            {activeColorStep === 6 && (
              <ColorPickerSample value={inboundMessageTextColor} toggle={toggleShowInboundMessageTextColorPicker} />
            )}
            {activeColorStep === 7 && (
              <ColorPickerSample value={outboundMessageBackgroundColor} toggle={toggleShowOutboundMessageColorPicker} />
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
          />
          <Input
            type="text"
            name="subtitle"
            value={subtitleText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSubtitleText(e.target.value), setChatpluginConfig({subtitleText: e.target.value});
            }}
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
          />
        </div>
        <div className={styles.borderLine} />
        <div className={styles.customiseContainerToggles}>
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
            <Toggle
              value={hideEmojis}
              text={t('disableEmojis')}
              updateValue={(value: boolean) => setHideEmojis(value)}
            />
          </div>
          <div className={styles.extraOptions}>
            <Toggle
              value={useCustomFont}
              text={t('useCustomFont')}
              updateValue={(value: boolean) => setUseCustomFont(value)}
            />
          </div>
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
