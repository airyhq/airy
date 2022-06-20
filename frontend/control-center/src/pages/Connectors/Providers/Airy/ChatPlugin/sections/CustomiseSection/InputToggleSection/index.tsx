import {Input, Toggle} from 'components';
import {Language} from 'model';
import React, {Dispatch, SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';
import styles from './index.module.scss';

type InputToggleSectionProps = {
  headerText: string;
  setHeaderText: Dispatch<SetStateAction<string>>;
  subtitleText: string;
  setSubtitleText: Dispatch<SetStateAction<string>>;
  startNewConversationText: string;
  setStartNewConversationText: Dispatch<SetStateAction<string>>;
  bubbleIcon: string;
  setBubbleIcon: Dispatch<SetStateAction<string>>;
  sendMessageIcon: string;
  setSendMessageIcon: Dispatch<SetStateAction<string>>;
  customHost: string;
  setCustomHost: Dispatch<SetStateAction<string>>;
  height: string;
  setHeight: Dispatch<SetStateAction<string>>;
  width: string;
  setWidth: Dispatch<SetStateAction<string>>;
  disableMobile: boolean;
  setDisableMobile: Dispatch<SetStateAction<boolean>>;
  hideInputBar: boolean;
  setHideInputBar: Dispatch<SetStateAction<boolean>>;
  hideEmojis: boolean;
  setHideEmojis: Dispatch<SetStateAction<boolean>>;
  useCustomFont: boolean;
  setUseCustomFont: Dispatch<SetStateAction<boolean>>;
  hideImages: boolean;
  setHideImages: Dispatch<SetStateAction<boolean>>;
  hideVideos: boolean;
  setHideVideos: Dispatch<SetStateAction<boolean>>;
  hideFiles: boolean;
  setHideFiles: Dispatch<SetStateAction<boolean>>;
};

export const InputToggleSection = (props: InputToggleSectionProps) => {
  const {
    headerText,
    setHeaderText,
    subtitleText,
    setSubtitleText,
    startNewConversationText,
    setStartNewConversationText,
    bubbleIcon,
    setBubbleIcon,
    sendMessageIcon,
    setSendMessageIcon,
    customHost,
    setCustomHost,
    height,
    setHeight,
    width,
    setWidth,
    disableMobile,
    setDisableMobile,
    hideInputBar,
    setHideInputBar,
    hideEmojis,
    setHideEmojis,
    useCustomFont,
    setUseCustomFont,
    hideImages,
    setHideImages,
    hideVideos,
    setHideVideos,
    hideFiles,
    setHideFiles,
  } = props;

  const currentLanguage = localStorage.getItem('language');
  const {t} = useTranslation();

  return (
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
  );
};
