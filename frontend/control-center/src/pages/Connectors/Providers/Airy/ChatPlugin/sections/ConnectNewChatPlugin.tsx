import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Input} from 'components';
import {cyChannelsChatPluginFormNameInput, cyChannelsChatPluginFormSubmitButton} from 'handles';
import styles from './ConnectNewChatPlugin.module.scss';
import {connectChatPlugin} from '../../../../../../actions/channel';
import {connect, ConnectedProps} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {CONNECTORS_ROUTE} from '../../../../../../routes/routes';

const mapDispatchToProps = {
  connectChatPlugin,
};

const connector = connect(null, mapDispatchToProps);

type ConnectNewChatPluginProps = {
  modal?: boolean;
  connectNew?: (id: string, showModal: boolean) => void;
} & ConnectedProps<typeof connector>;

const ConnectNewChatPlugin = (props: ConnectNewChatPluginProps) => {
  const {modal, connectNew, connectChatPlugin} = props;
  const [displayName, setDisplayName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const {t} = useTranslation();
  const navigate = useNavigate();
  const CHAT_PLUGIN_ROUTE = `${CONNECTORS_ROUTE}/chatplugin`;

  const createNewConnection = (displayName: string, imageUrl?: string) => {
    connectChatPlugin({
      name: displayName,
      ...(imageUrl.length > 0 && {
        imageUrl: imageUrl,
      }),
    })
      .then((id: string) => {
        modal ? navigate(`${CHAT_PLUGIN_ROUTE}/${id}`) : connectNew(id, true);
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };

  return (
    <form className={modal ? styles.formWrapperModal : styles.formWrapper}>
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
          showLabelIcon
          tooltipText={t('imageUrlHint')}
          placeholder={t('imageUrlPlaceholder')}
          height={32}
          fontClass="font-base"
        />
      </div>
      <Button
        type="submit"
        styleVariant="small"
        disabled={displayName === ''}
        style={{width: '176px', height: '40px'}}
        dataCy={cyChannelsChatPluginFormSubmitButton}
        onClick={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          createNewConnection(displayName, imageUrl);
        }}
      >
        {t('create')}
      </Button>
    </form>
  );
};

export default connector(ConnectNewChatPlugin);
