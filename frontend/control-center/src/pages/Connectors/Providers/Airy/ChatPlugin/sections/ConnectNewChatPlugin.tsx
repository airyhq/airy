import React, {useState} from 'react';

import {Button, Input} from 'components';

import styles from './ConnectNewChatPlugin.module.scss';

import {cyChannelsChatPluginFormNameInput, cyChannelsChatPluginFormSubmitButton} from 'handles';
import {useTranslation} from 'react-i18next';

interface ConnectNewChatPluginProps {
  createNewConnection: (displayName: string, imageUrl?: string) => void;
}

export const ConnectNewChatPlugin = ({createNewConnection}: ConnectNewChatPluginProps) => {
  const [displayName, setDisplayName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const {t} = useTranslation();

  return (
    <div>
      <p className={styles.newPageParagraph}>{t('addChatplugin')}</p>
      <div className={styles.formWrapper}>
        <div className={styles.settings}>
          <form>
            <div className={styles.formRow}>
              <Input
                type="text"
                name="displayName"
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDisplayName(e.target.value);
                }}
                label={t('displayName')}
                placeholder={t('addDisplayName')}
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
            <Button
              type="submit"
              styleVariant="small"
              dataCy={cyChannelsChatPluginFormSubmitButton}
              onClick={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                createNewConnection(displayName, imageUrl);
              }}
            >
              {t('save')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
