import React, {Dispatch, SetStateAction, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Input, SmartButton} from 'components';
import {cyChannelsChatPluginFormNameInput} from 'handles';
import {updateChannel} from '../../../../../../../actions/channel';
import styles from './CreateUpdateSection.module.scss';
import {Channel, NotificationModel} from 'model';

const mapDispatchToProps = {
  updateChannel,
};

const connector = connect(null, mapDispatchToProps);

type InstallUpdateSectionProps = {
  channel: Channel;
  displayName: string;
  imageUrl: string;
  setNotification: Dispatch<SetStateAction<NotificationModel>>;
} & ConnectedProps<typeof connector>;

const CreateUpdateSection = (props: InstallUpdateSectionProps) => {
  const {channel, displayName, imageUrl, setNotification} = props;

  const [submit, setSubmit] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(displayName || channel?.metadata?.name);
  const [newImageUrl, setNewImageUrl] = useState(imageUrl || channel?.metadata?.imageUrl);
  const [isPending, setIsPending] = useState(false);
  const {t} = useTranslation();

  const updateConnection = (displayName: string, imageUrl?: string) => {
    setIsPending(true);
    props
      .updateChannel({channelId: channel.id, name: displayName, imageUrl: imageUrl})
      .then(() => {
        setNotification({show: true, text: t('updateSuccessful'), successful: true});
      })
      .catch((error: Error) => {
        setNotification({show: true, text: t('updateFailed'), successful: false});
        console.error(error);
      })
      .finally(() => {
        setIsPending(true);
      });
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.settings}>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            submit && updateConnection(newDisplayName, newImageUrl);
          }}
        >
          <div className={styles.formRow}>
            <Input
              type="text"
              name="displayName"
              value={newDisplayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewDisplayName(e.target.value);
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
              value={newImageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewImageUrl(e.target.value);
              }}
              label={t('imageUrl')}
              placeholder={t('imageUrlPlaceholder')}
              showLabelIcon
              tooltipText={t('imageUrlHint')}
              height={32}
              fontClass="font-base"
            />
          </div>
          <SmartButton
            title={t('update')}
            height={40}
            width={160}
            onClick={() => setSubmit(true)}
            pending={isPending}
            type="submit"
            styleVariant="small"
            disabled={newDisplayName === '' || newDisplayName === displayName || isPending}
          />
        </form>
      </div>
    </div>
  );
};

export default connector(CreateUpdateSection);
