import React from 'react';
import {Button, Input} from 'components';
import {Channel} from 'model';
import styles from './InstallUpdateSection.module.scss';
import {cyChannelsChatPluginFormNameInput} from 'handles';
import {useTranslation} from 'react-i18next';
import {Pages} from '../ChatPluginConnect';

interface InstallUpdateSectionProps {
  channel: Channel;
  host: string;
  updateConnection(displayName: string, imageUrl?: string): void;
  currentPage: Pages;
  displayName: string;
  setDisplayName: (newDisplayName: string) => void;
  imageUrl: string;
  setImageUrl: (newImageUrl: string) => void;
}

export const CreateUpdateSection = (props: InstallUpdateSectionProps) => {
  const {channel, host, updateConnection, currentPage, displayName, setDisplayName, imageUrl, setImageUrl} = props;
  const {t} = useTranslation();

  return (
    <div className={styles.formWrapper}>
      <div className={styles.settings}>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            updateConnection(displayName, imageUrl);
          }}>
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
};
