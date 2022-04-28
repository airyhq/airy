import React, {useState} from 'react';

import {Button, Input} from 'components';

import styles from './ConnectNewChatPlugin.module.scss';

import {cyChannelsChatPluginFormNameInput, cyChannelsChatPluginFormSubmitButton} from 'handles';

interface ConnectNewChatPluginProps {
  createNewConnection: (displayName: string, imageUrl?: string) => void;
}

export const ConnectNewChatPlugin = ({createNewConnection}: ConnectNewChatPluginProps) => {
  const [displayName, setDisplayName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div>
      <p className={styles.newPageParagraph}>Add Airy Live Chat to your website and application</p>
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
                label="Display Name"
                placeholder="Add a name"
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
                label="Image URL"
                placeholder="(optionally) add an image url"
                hint="max. 1024x1024 pixel PNG"
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
              Save
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
