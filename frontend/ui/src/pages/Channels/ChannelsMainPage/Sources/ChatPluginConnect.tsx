import React, {FormEvent, useEffect, useState, MouseEvent, createRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {Button, Input, LinkButton} from '@airyhq/components';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {Channel} from 'httpclient';

import {ReactComponent as AiryLogo} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';

import {env} from '../../../../env';
import {CHANNELS_CHAT_PLUGIN_ROUTE, CHANNELS_CONNECTED_ROUTE} from '../../../../routes/routes';
import {connectChatPlugin, updateChannel, disconnectChannel} from '../../../../actions/channel';
import {StateModel} from '../../../../reducers';
import {allChannels} from '../../../../selectors/channels';

import styles from './ChatPluginConnect.module.scss';

const mapDispatchToProps = {
  connectChatPlugin,
  updateChannel,
  disconnectChannel,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
  config: state.data.config,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

interface ChatPluginRouterProps {
  channelId?: string;
}

type ChatPluginProps = {} & ConnectedProps<typeof connector> & RouteComponentProps<ChatPluginRouterProps>;

const ChatPluginConnect = (props: ChatPluginProps) => {
  const [showNewPage, setShowNewPage] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentPage, setCurrentPage] = useState('settings');
  const channelId = props.match.params.channelId;
  const codeAreaRef = createRef<HTMLTextAreaElement>();

  useEffect(() => {
    setShowNewPage(true);
    setCurrentPage('settings');
  }, []);

  useEffect(() => {
    if (channelId !== 'new' && channelId?.length) {
      const channel = props.channels.find((channel: Channel) => {
        return channel.id === channelId;
      });
      if (channel) {
        setDisplayName(channel.metadata?.name || '');
        setImageUrl(channel.metadata?.imageUrl || '');
      }
    }
  }, [props.channels, channelId]);

  const createNewConnection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props
      .connectChatPlugin({
        name: displayName,
        ...(imageUrl.length > 0 && {
          imageUrl: imageUrl,
        }),
      })
      .then((channel: Channel) => {
        props.history.replace(CHANNELS_CHAT_PLUGIN_ROUTE + '/' + channel.id);
      });
  };

  const updateConnection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.updateChannel({channelId: channelId, name: displayName, imageUrl: imageUrl}).then(() => {
      props.history.replace(CHANNELS_CONNECTED_ROUTE + '/chat_plugin');
    });
  };

  const renderFormFields = () => (
    <>
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
          autoFocus
          required
          height={32}
          fontClass="font-s"
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
          placeholder="(optionaly) add an image url"
          hint="max. 1024x1024 pixel PNG"
          height={32}
          fontClass="font-s"
        />
      </div>
    </>
  );

  const renderNewPage = () => {
    return showNewPage ? (
      <div>
        <p className={styles.newPageParagraph}>Add Airy Live Chat to your website and application</p>

        <Button type="button" onClick={() => setShowNewPage(false)}>
          Connect Airy Live Chat
        </Button>
      </div>
    ) : (
      <div>
        <p className={styles.newPageParagraph}>Add Airy Live Chat to your website and application</p>
        <div className={styles.formWrapper}>
          <div className={styles.settings}>
            <form className={styles.form} onSubmit={createNewConnection}>
              {renderFormFields()}
              <Button type="submit" styleVariant="small">
                Save
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const showSettings = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage('settings');
  };

  const showInstallDoc = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage('installDoc');
  };

  const generateCode = () => {
    return `<script>
  (function(w, d, s, n) {
    w[n] = w[n] || {};
    w[n].channelId = "${channelId}";
    w[n].host = "${'//' + env.CHATPLUGIN_HOST}";
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s);
    j.async = true;
    j.src = w[n].host + "/s.js";
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "airy");
</script>`;
  };

  const copyToClipboard = () => {
    codeAreaRef.current?.select();
    document.execCommand('copy');
  };

  const renderChannelPage = () => (
    <div>
      <p className={styles.updatePageParagraph}>Add Airy Live Chat to your website and application</p>
      <ul className={styles.tabView}>
        <li className={currentPage == 'settings' ? styles.tabEntrySelected : styles.tabEntry}>
          <a href="#" onClick={showSettings}>
            Settings
          </a>
        </li>
        <li className={currentPage == 'installDoc' ? styles.tabEntrySelected : styles.tabEntry}>
          <a href="#" onClick={showInstallDoc}>
            Install app
          </a>
        </li>
      </ul>
      <div className={styles.formWrapper}>
        {currentPage === 'settings' ? (
          <div className={styles.settings}>
            <form className={styles.form} onSubmit={updateConnection}>
              {renderFormFields()}

              <Button type="submit" styleVariant="small">
                Update
              </Button>
            </form>
          </div>
        ) : (
          <div className={styles.installDocs}>
            <div className={styles.installHint}>
              Add this code inside the tag <code>&lt;head&gt;</code>:
            </div>
            <div>
              <textarea readOnly className={styles.codeArea} ref={codeAreaRef} value={generateCode()}></textarea>
            </div>
            <Button onClick={copyToClipboard}>Copy code</Button>
          </div>
        )}
      </div>
    </div>
  );

  const disconnectChannel = (channel: Channel) => {
    if (window.confirm('Do you really want to delete this channel?')) {
      props.disconnectChannel('chatplugin', {channelId: channel.id});
    }
  };

  const renderOverviewPage = () => (
    <div className={styles.overview}>
      <ul>
        {props.channels.map((channel: Channel) => (
          <li key={channel.id} className={styles.listItem}>
            <div className={styles.channelLogo}>
              {channel.metadata?.imageUrl ? (
                <img src={channel.metadata?.imageUrl} alt={channel.metadata?.name} className={styles.channelImage} />
              ) : (
                <div className={styles.placeholderLogo}>
                  <AiryLogo />{' '}
                </div>
              )}
            </div>

            <div className={styles.listChannelName}>{channel.metadata?.name}</div>
            <div className={styles.listButtons}>
              <Link className={styles.listButtonEdit} to={`${CHANNELS_CHAT_PLUGIN_ROUTE}/${channel.id}`}>
                Edit
              </Link>
              <LinkButton
                type="button"
                onClick={() => {
                  disconnectChannel(channel);
                }}>
                Delete
              </LinkButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const openNewPage = () => {
    props.history.push(CHANNELS_CHAT_PLUGIN_ROUTE + '/new');
  };

  const renderPage = () => {
    if (channelId === 'new') {
      return renderNewPage();
    }

    if (channelId?.length > 0) {
      return renderChannelPage();
    }

    return renderOverviewPage();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headline}>
        <h1 className={styles.headlineText}>Airy Live Chat</h1>
        {channelId == null && (
          <div className={styles.addButton}>
            <Button onClick={openNewPage}>
              <span title="Add channel">+</span>
            </Button>
          </div>
        )}
      </div>

      <LinkButton onClick={props.history.goBack} type="button">
        <BackIcon className={styles.backIcon} />
        Back
      </LinkButton>

      {renderPage()}
    </div>
  );
};

export default connector(withRouter(ChatPluginConnect));
