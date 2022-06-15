import {Button, ErrorNotice} from 'components';
import {useLocalState} from '../../../../../../../../control-center/src/services';
import React, {createRef} from 'react';
import {useTranslation} from 'react-i18next';
import styles from './InstallSection.module.scss';
import {BubbleState, CloseOption} from './CustomiseSection';

export interface ChatpluginConfig {
  headerText?: string;
  subtitleText?: string;
  startNewConversationText?: string;
  bubbleIconUrl?: string;
  sendMessageIconUrl?: string;
  headerTextColor?: string;
  subtitleTextColor?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  inboundMessageBackgroundColor?: string;
  inboundMessageTextColor?: string;
  outboundMessageBackgroundColor?: string;
  outboundMessageTextColor?: string;
  unreadMessageDotColor?: string;
  height?: string;
  width?: string;
  closingOption?: CloseOption;
  bubbleState?: BubbleState;
  disableMobile?: boolean;
  hideInputBar?: boolean;
  hideEmojis?: boolean;
  useCustomFont?: boolean;
  customFont?: string;
  hideAttachments?: boolean;
  hideImages?: boolean;
  hideVideos?: boolean;
  hideFiles?: boolean;
}

type InstallSectionProps = {
  channelId: string;
  host: string;
  chatpluginConfig: ChatpluginConfig;
};

export const InstallSection = (props: InstallSectionProps) => {
  const {channelId, host, chatpluginConfig} = props;
  const {
    headerText,
    subtitleText,
    startNewConversationText,
    bubbleIconUrl,
    sendMessageIconUrl,
    headerTextColor,
    subtitleTextColor,
    primaryColor,
    accentColor,
    backgroundColor,
    inboundMessageBackgroundColor,
    inboundMessageTextColor,
    outboundMessageBackgroundColor,
    outboundMessageTextColor,
    unreadMessageDotColor,
    height,
    width,
    closingOption,
    bubbleState,
    disableMobile,
    hideInputBar,
    hideEmojis,
    useCustomFont,
    customFont,
    hideAttachments,
    hideImages,
    hideVideos,
    hideFiles,
  } = chatpluginConfig;
  const {t} = useTranslation();
  const [customHost, setCustomHost] = useLocalState('customHost', host);
  const codeAreaRef = createRef<HTMLTextAreaElement>();
  const codeAreaRefNpm = createRef<HTMLTextAreaElement>();

  const getTemplateConfig = (isNpm: boolean) => {
    const config = [
      headerText ? `headerText: '${headerText}'` : `headerText: ''`,
      subtitleText ? `subtitleText: '${subtitleText}'` : `subtitleText: '${subtitleText}'`,
      startNewConversationText && `startNewConversationText: '${startNewConversationText}'`,
      bubbleIconUrl && `bubbleIcon: '${bubbleIconUrl}'`,
      sendMessageIconUrl && `sendMessageIcon: '${sendMessageIconUrl}'`,
      headerTextColor && `headerTextColor: '${headerTextColor}'`,
      subtitleTextColor && `subtitleTextColor: '${subtitleTextColor}'`,
      primaryColor && `primaryColor: '${primaryColor}'`,
      accentColor && `accentColor: '${accentColor}'`,
      backgroundColor && `backgroundColor: '${backgroundColor}'`,
      inboundMessageBackgroundColor && `inboundMessageColor: '${inboundMessageBackgroundColor}'`,
      inboundMessageTextColor && `inboundMessageTextColor: '${inboundMessageTextColor}'`,
      outboundMessageBackgroundColor && `outboundMessageColor: '${outboundMessageBackgroundColor}'`,
      outboundMessageTextColor && `outboundMessageTextColor: '${outboundMessageTextColor}'`,
      unreadMessageDotColor && `unreadMessageDotColor: '${unreadMessageDotColor}'`,
      height && `height: '${height}'`,
      width && `width: '${width}'`,
      `closeMode: '${closingOption}'`,
      `bubbleState: '${bubbleState}'`,
      `disableMobile: '${disableMobile}'`,
      `hideInputBar: '${hideInputBar}'`,
      `hideEmojis: '${hideEmojis}'`,
      `useCustomFont: '${useCustomFont}'`,
      `customFont: '${customFont}'`,
      `hideAttachments: '${hideAttachments}'`,
      `hideImages: '${hideImages}'`,
      `hideVideos: '${hideVideos}'`,
      `hideFiles: '${hideFiles}'`,
    ];

    return isNpm
      ? `${config.filter(it => it !== '').join(',\n        ')}};`
      : `w[n].config = {${'\n           '}${config.filter(it => it !== '').join(',\n           ')}\n        };`;
  };

  const copyToClipboard = (isNpm: boolean) => {
    isNpm ? codeAreaRefNpm.current?.select() : codeAreaRef.current?.select();
    document.execCommand('copy');
  };

  const getCodeScript = () =>
    `<script>
            (function(w, d, s, n) {
              w[n] = w[n] || {};
              w[n].channelId = '${channelId}';
              w[n].host = '${customHost}';
              ${getTemplateConfig(false)}
              var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s);
              j.async = true;
              j.src = w[n].host + '/chatplugin/ui/s.js';
              f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'airy');
          </script>`;

  const getCodeNpm = () =>
    `
    import React from "react";
    import {AiryChatPlugin, AiryChatPluginConfiguration} from "@airyhq/chat-plugin";
    
    const Component = () => {
      const config: AiryChatPluginConfiguration = {
        apiHost: '${customHost}',
        channelId: '${channelId}',
        ${getTemplateConfig(true)}
      };
    
      return (
        <div className="demoChatPlugin">
          <AiryChatPlugin config={config} />
        </div>
      );
    };`;

  return (
    <div className={styles.container}>
      <h1>{t('chatpluginTitle')}</h1>
      <h2>{t('chatpluginInstallText')}</h2>
      <div className={styles.codeAreaContainer}>
        <div className={styles.codeAreaBox}>
          <div className={styles.installHint}>
            {t('addCodeTagHead')}
            <code>&lt;head&gt;</code>:
          </div>
          <div>
            <textarea readOnly className={styles.codeArea} ref={codeAreaRef} value={getCodeScript()} />
          </div>
          <div className={styles.copyButtonHostName}>
            <Button onClick={() => copyToClipboard(false)} disabled={customHost.length == 0}>
              {t('copyCode')}
            </Button>
            {customHost.length == 0 && (
              <div style={{marginLeft: '8px'}}>
                <ErrorNotice theme="warning">You need to add a Host URL</ErrorNotice>
              </div>
            )}
          </div>
        </div>
        <div className={styles.codeAreaBox}>
          <div className={styles.installHint}>
            {t('installCodeNpm1')}
            <span>NPM</span>
            {t('installCodeNpm2')}
          </div>
          <div>
            <textarea readOnly className={styles.codeArea} ref={codeAreaRefNpm} value={getCodeNpm()} />
          </div>
          <div className={styles.copyButtonHostName}>
            <Button onClick={() => copyToClipboard(true)} disabled={customHost.length == 0}>
              {t('copyCode')}
            </Button>
            {customHost.length == 0 && (
              <div style={{marginLeft: '8px'}}>
                <ErrorNotice theme="warning">You need to add a Host URL</ErrorNotice>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
