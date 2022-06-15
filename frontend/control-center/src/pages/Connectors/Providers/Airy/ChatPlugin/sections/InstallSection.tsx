import {Button, ErrorNotice} from 'components';
import React, {createRef} from 'react';
import {useTranslation} from 'react-i18next';
import styles from './InstallSection.module.scss';
import {Config} from '../../../../../../../../chat-plugin/lib';

type InstallSectionProps = {
  channelId: string;
  host: string;
  chatpluginConfig: Config;
};

export const InstallSection = (props: InstallSectionProps) => {
  const {channelId, host, chatpluginConfig} = props;
  const {
    headerText,
    subtitleText,
    startNewConversationText,
    bubbleIcon,
    sendMessageIcon,
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
    height,
    width,
    closeMode,
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
  const codeAreaRef = createRef<HTMLTextAreaElement>();
  const codeAreaRefNpm = createRef<HTMLTextAreaElement>();

  const getTemplateConfig = (isNpm: boolean) => {
    const config = [
      headerText ? `headerText: '${headerText}'` : `headerText: ''`,
      subtitleText ? `subtitleText: '${subtitleText}'` : `subtitleText: '${subtitleText}'`,
      startNewConversationText && `startNewConversationText: '${startNewConversationText}'`,
      bubbleIcon && `bubbleIcon: '${bubbleIcon}'`,
      sendMessageIcon && `sendMessageIcon: '${sendMessageIcon}'`,
      headerTextColor && `headerTextColor: '${headerTextColor}'`,
      subtitleTextColor && `subtitleTextColor: '${subtitleTextColor}'`,
      primaryColor && `primaryColor: '${primaryColor}'`,
      accentColor && `accentColor: '${accentColor}'`,
      backgroundColor && `backgroundColor: '${backgroundColor}'`,
      inboundMessageColor && `inboundMessageColor: '${inboundMessageColor}'`,
      inboundMessageTextColor && `inboundMessageTextColor: '${inboundMessageTextColor}'`,
      outboundMessageColor && `outboundMessageColor: '${outboundMessageColor}'`,
      outboundMessageTextColor && `outboundMessageTextColor: '${outboundMessageTextColor}'`,
      unreadMessageDotColor && `unreadMessageDotColor: '${unreadMessageDotColor}'`,
      height && `height: '${height}'`,
      width && `width: '${width}'`,
      `closeMode: '${closeMode}'`,
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
      ? `${config.filter(it => it !== '').join(',\n        ')}`
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
              w[n].host = '${host}';
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
        apiHost: '${host}',
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
            <Button onClick={() => copyToClipboard(false)} disabled={host.length == 0}>
              {t('copyCode')}
            </Button>
            {host.length == 0 && (
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
            <Button onClick={() => copyToClipboard(true)} disabled={host.length == 0}>
              {t('copyCode')}
            </Button>
            {host.length == 0 && (
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
