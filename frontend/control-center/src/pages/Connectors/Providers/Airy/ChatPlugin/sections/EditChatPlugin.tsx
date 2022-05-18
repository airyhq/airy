import React, {useEffect, useState} from 'react';

import {Button, Input} from 'components';
import {Channel} from 'model';

import {CustomiseSection} from './CustomiseSection';

import styles from './EditChatPlugin.module.scss';

import {cyChannelsChatPluginFormNameInput} from 'handles';
import {useTranslation} from 'react-i18next';

interface EditChatPluginProps {
  channel: Channel;
  host: string;
  updateConnection(displayName: string, imageUrl?: string): void;
}

export const EditChatPlugin = ({channel, host, updateConnection}: EditChatPluginProps) => {
  const [currentPage, setCurrentPage] = useState('settings');
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('settings');
  }, []);

  const showSettings = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage('settings');
  };

  const showCustomization = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage('install-customization');
  };

  const ConnectContent = () => {
    const [displayName, setDisplayName] = useState(channel?.metadata?.name || '');
    const [imageUrl, setImageUrl] = useState(channel?.metadata?.imageUrl || '');

    switch (currentPage) {
      case 'settings':
        return (
          <div className={styles.formWrapper}>
            <div className={styles.settings}>
              <form
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  updateConnection(displayName, imageUrl);
                }}
              >
                <div className={styles.formRow}>
                  <Input
                    type="text"
                    name="displayName"
                    value={displayName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setDisplayName(e.target.value);
                    }}
                    label={t('displayName')}
                    placeholder={t('addAName')}
                    required
                    height={32}
                    fontClass="font-base"
                    dataCy={cyChannelsChatPluginFormNameInput}
                  />
                </div>

                <div className={styles.formRow}>
                  <Input
                    type="url"
                    name="url"
                    value={imageUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setImageUrl(e.target.value);
                    }}
                    label={t('imageUrl')}
                    placeholder={t('imageUrlPlaceholder')}
                    hint={t('imageUrlHint')}
                    height={32}
                    fontClass="font-base"
                  />
                </div>
                <Button type="submit" styleVariant="small">
                  {t('update')}
                </Button>
              </form>
            </div>
          </div>
        );
      case 'install-customization':
        return (
          <div className={styles.formWrapper}>
            <CustomiseSection channelId={channel?.id} host={host} />
          </div>
        );
    }
  };

  return (
    <div>
      <p className={styles.updatePageParagraph}>{t('addLiveChatToWebsite')}</p>
      <ul className={styles.tabView}>
        <li className={currentPage == 'settings' ? styles.tabEntrySelected : styles.tabEntry}>
          <a href="#" onClick={showSettings}>
            {t('settings')}
          </a>
        </li>
        <li className={currentPage == 'install-customization' ? styles.tabEntrySelected : styles.tabEntry}>
          <a href="#" onClick={showCustomization}>
            {t('installCustomize')}
          </a>
        </li>
      </ul>
      <ConnectContent />
    </div>
  );
};
