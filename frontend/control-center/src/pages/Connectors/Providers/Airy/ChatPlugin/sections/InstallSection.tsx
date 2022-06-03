import { Button, ErrorNotice } from 'components';
import { useLocalState } from '../../../../../../../../control-center/src/services';
import React, { createRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './InstallSection.module.scss';

type InstallSectionProps = {
    channelId: string;
    host: string;
  }

export const InstallSection = (props: InstallSectionProps) => {
    const {channelId, host} = props;
    const {t} = useTranslation();
    const [customHost, setCustomHost] = useLocalState('customHost', host);
    const codeAreaRef = createRef<HTMLTextAreaElement>();

    const getTemplateConfig = () => {
        const config = [
        //   headerText && `headerText: '${headerText}'`,
        //   subtitleText && `subtitleText: '${subtitleText}'`,
        //   startNewConversationText && `startNewConversationText: '${startNewConversationText}'`,
        //   bubbleIconUrl && `bubbleIcon: '${bubbleIconUrl}'`,
        //   sendMessageIconUrl && `sendMessageIcon: '${sendMessageIconUrl}'`,
        //   headerTextColor && `headerTextColor: '${headerTextColor}'`,
        //   subtitleTextColor && `subtitleTextColor: '${subtitleTextColor}'`,
        //   primaryColor && `primaryColor: '${primaryColor}'`,
        //   accentColor && `accentColor: '${accentColor}'`,
        //   backgroundColor && `backgroundColor: '${backgroundColor}'`,
        //   inboundMessageBackgroundColor && `inboundMessageColor: '${inboundMessageBackgroundColor}'`,
        //   inboundMessageTextColor && `inboundMessageTextColor: '${inboundMessageTextColor}'`,
        //   outboundMessageBackgroundColor && `outboundMessageColor: '${outboundMessageBackgroundColor}'`,
        //   outboundMessageTextColor && `outboundMessageTextColor: '${outboundMessageTextColor}'`,
        //   unreadMessageDotColor && `unreadMessageDotColor: '${unreadMessageDotColor}'`,
        //   height && `height: '${height}'`,
        //   width && `width: '${width}'`,
        //   `closeMode: '${closingOption}'`,
        //   `bubbleState: '${bubbleState}'`,
        //   `disableMobile: '${disableMobile}'`,
        //   `hideInputBar: '${hideInputBar}'`,
        //   `hideEmojis: '${hideEmojis}'`,
        //   `useCustomFont: '${useCustomFont}'`,
        //   `customFont: '${customFont}'`,
        //   `hideAttachments: '${hideAttachments}'`,
        //   `hideImages: '${hideImages}'`,
        //   `hideVideos: '${hideVideos}'`,
        //   `hideFiles: '${hideFiles}'`,
        ];
    
        return `w[n].config = {${'\n           '}${config.filter(it => it !== '').join(',\n           ')}\n        };`;
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
              w[n].host = '${customHost}';
              ${getTemplateConfig()}
              var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s);
              j.async = true;
              j.src = w[n].host + '/chatplugin/ui/s.js';
              f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'airy');
          </script>`;

    return (
        <div className={styles.codeAreaContainer}>
        <div className={styles.installHint}>
          {t('addCodeTagHead')}
          <code>&lt;head&gt;</code>:
        </div>
        <div>
          <textarea readOnly className={styles.codeArea} ref={codeAreaRef} value={getCode()} />
        </div>
        <div className={styles.copyButtonHostName}>
          <Button onClick={copyToClipboard} disabled={customHost.length == 0}>
            {t('copyCode')}
          </Button>
          {customHost.length == 0 && (
            <div style={{marginLeft: '8px'}}>
              <ErrorNotice theme="warning">You need to add a Host URL</ErrorNotice>
            </div>
          )}
        </div>
      </div>
    )
}