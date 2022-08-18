import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {Dropdown} from 'components';
import styles from './CustomiseSection.module.scss';
import {AiryChatPlugin, AiryChatPluginConfiguration} from 'chat-plugin';
import {env} from '../../../../../../../env';
import {getUseLocalState} from '../../../../../../../services/hooks/localState';
import {fetchGoogleFonts} from '../../../../../../../api/index';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {BubbleState, ChatpluginConfig, CloseOption, DefaultColors, DefaultConfig} from 'model';
import {isEqual} from 'lodash-es';
import {ColorSection} from './ColorSection';
import {InputToggleSection} from './InputToggleSection';

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
  const [primaryColor, setPrimaryColor] = useLocalState('primaryColor', `${DefaultColors.primaryColor}`);
  const [accentColor, setAccentColor] = useLocalState('accentColor', `${DefaultColors.accentColor}`);
  const [backgroundColor, setBackgroundColor] = useLocalState('backgroundColor', `${DefaultColors.backgroundColor}`);
  const [inboundMessageColor, setInboundMessageColor] = useLocalState(
    'inboundMessageColor',
    `${DefaultColors.inboundMessageColor}`
  );
  const [inboundMessageTextColor, setInboundMessageTextColor] = useLocalState(
    'inboundMessageTextColor',
    `${DefaultColors.inboundMessageTextColor}`
  );
  const [outboundMessageColor, setOutboundMessageColor] = useLocalState(
    'outboundMessageColor',
    `${DefaultColors.outboundMessageColor}`
  );
  const [outboundMessageTextColor, setOutboundMessageTextColor] = useLocalState(
    'outboundMessageTextColor',
    `${DefaultColors.outboundMessageTextColor}`
  );
  const [unreadMessageDotColor, setUnreadMessageDotColor] = useLocalState(
    'unreadMessageDotColor',
    `${DefaultColors.unreadMessageDotColor}`
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
              href={`${location.protocol}//${location.host}/chatplugin/ui/example?channel_id=${channelId}`}
              target="_blank"
              rel="noreferrer"
            >
              {t('preview')}
            </a>
          </div>
          <h1>{t('chatpluginTitle')}</h1>
          <h2>{t('chatpluginCustomize')}</h2>
        </div>
        <ColorSection
          setColorStepText={setColorStepText}
          headerTextColor={headerTextColor}
          setHeaderTextColor={setHeaderTextColor}
          subtitleTextColor={subtitleTextColor}
          setSubtitleTextColor={setSubtitleTextColor}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          inboundMessageColor={inboundMessageColor}
          setInboundMessageColor={setInboundMessageColor}
          inboundMessageTextColor={inboundMessageTextColor}
          setInboundMessageTextColor={setInboundMessageTextColor}
          outboundMessageColor={outboundMessageColor}
          setOutboundMessageColor={setOutboundMessageColor}
          outboundMessageTextColor={outboundMessageTextColor}
          setOutboundMessageTextColor={setOutboundMessageTextColor}
          unreadMessageDotColor={unreadMessageDotColor}
          setUnreadMessageDotColor={setUnreadMessageDotColor}
        />
      </div>
      <div className={styles.borderLine} />
      <InputToggleSection
        headerText={headerText}
        setHeaderText={setHeaderText}
        subtitleText={subtitleText}
        setSubtitleText={setSubtitleText}
        startNewConversationText={startNewConversationText}
        setStartNewConversationText={setStartNewConversationText}
        bubbleIcon={bubbleIcon}
        setBubbleIcon={setBubbleIcon}
        sendMessageIcon={sendMessageIcon}
        setSendMessageIcon={setSendMessageIcon}
        customHost={customHost}
        setCustomHost={setCustomHost}
        height={height}
        setHeight={setHeight}
        width={width}
        setWidth={setWidth}
        disableMobile={disableMobile}
        setDisableMobile={setDisableMobile}
        hideInputBar={hideInputBar}
        setHideInputBar={setHideInputBar}
        hideEmojis={hideEmojis}
        setHideEmojis={setHideEmojis}
        useCustomFont={useCustomFont}
        setUseCustomFont={setUseCustomFont}
        hideImages={hideImages}
        setHideImages={setHideImages}
        hideVideos={hideVideos}
        setHideVideos={setHideVideos}
        hideFiles={hideFiles}
        setHideFiles={setHideFiles}
      />
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
