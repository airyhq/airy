import React, {useState} from 'react';
import {Button, Input} from 'components';
import styles from './CreateUpdateSection.module.scss';
import {cyChannelsChatPluginFormNameInput} from 'handles';
import {useTranslation} from 'react-i18next';
import {updateChannel} from '../../../../../../../actions/channel';
import {connect, ConnectedProps} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Channel} from 'model';

import {CATALOG_CONNECTED_ROUTE, CONNECTORS_CONNECTED_ROUTE} from '../../../../../../../routes/routes';

const mapDispatchToProps = {
  updateChannel,
};

const connector = connect(null, mapDispatchToProps);

type InstallUpdateSectionProps = {
  channel: Channel;
  displayName: string;
  imageUrl: string;
} & ConnectedProps<typeof connector>;

const CreateUpdateSection = (props: InstallUpdateSectionProps) => {
  const {channel, displayName, imageUrl} = props;
  const [submit, setSubmit] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(displayName || channel?.metadata?.name);
  const [newImageUrl, setNewImageUrl] = useState(imageUrl || channel?.metadata?.imageUrl);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const CONNECTED_ROUTE = location.pathname.includes('connectors')
    ? CONNECTORS_CONNECTED_ROUTE
    : CATALOG_CONNECTED_ROUTE;

  const updateConnection = (displayName: string, imageUrl?: string) => {
    props.updateChannel({channelId: channel.id, name: displayName, imageUrl: imageUrl}).then(() => {
      navigate(CONNECTED_ROUTE + '/chatplugin', {replace: true});
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
          <Button
            onClick={() => setSubmit(true)}
            disabled={newDisplayName === '' || newDisplayName === displayName}
            type="submit"
            styleVariant="small"
            style={{width: '176px', height: '40px', marginTop: '16px'}}
          >
            {t('update')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default connector(CreateUpdateSection);
