import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {CHANNELS_FACEBOOK_ROUTE, CHANNELS_CHAT_PLUGIN_ROUTE, CHANNELS_ROUTE} from './../../../routes/routes';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as AddChannelIcon} from 'assets/images/icons/plus.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import {StateModel} from './../../../reducers';
import {Channel} from 'httpclient';
import {allChannels} from './../../../selectors/channels';
import {ChannelSource, channelNameSorter} from 'httpclient';
import ChannelListItem from './ChannelListItem';
import {SearchField} from '@airyhq/components';
import styles from './ChannelsList.module.scss';

type ChannelsListProps = {} & ConnectedProps<typeof connector> & RouteComponentProps<{source: string}>;

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
});

const connector = connect(mapStateToProps, null);

const ChannelsList = (props: ChannelsListProps) => {
  const {channels} = props;
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showingSearchField, setShowingSearchField] = useState(false);
  const source = props.match.params.source;

  const filteredChannels = channels
    .filter((channel: Channel) => channel?.source === source)
    .filter((channel: Channel) => channel?.metadata?.name?.toLowerCase().includes(searchText.toLowerCase()));

  useEffect(() => {
    setPageTitle();
  }, [source, channels]);

  const setPageTitle = () => {
    switch (source) {
      case ChannelSource.facebook:
        setName('Facebook Messenger');
        setPath(CHANNELS_FACEBOOK_ROUTE);
        break;
      case ChannelSource.google:
        setName('Google');
        setPath('');
        break;
      case ChannelSource.twilioSMS:
        setName('Twilio SMS');
        setPath('');
        break;
      case ChannelSource.twilioWhatsapp:
        setName('Twilio Whatsapp');
        setPath('');
        break;
      case ChannelSource.chatPlugin:
        setName('Chat Plugin');
        setPath(CHANNELS_CHAT_PLUGIN_ROUTE + '/new');
        break;
    }
  };

  const searchFieldState = () => {
    if (showingSearchField) {
      setShowingSearchField(false);
      setSearchText('');
    } else {
      setShowingSearchField(true);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headlineRow}>
        <h1 className={styles.headline}>{name}</h1>
        <div className={styles.searchFieldButtons}>
          <div className={styles.searchField}>
            {showingSearchField && (
              <SearchField
                placeholder="Search"
                value={searchText}
                setValue={(value: string) => setSearchText(value)}
                autoFocus={true}
                resetClicked={() => setSearchText('')}
              />
            )}
          </div>
          <div className={styles.buttons}>
            <button onClick={() => searchFieldState()}>{showingSearchField ? <CloseIcon /> : <SearchIcon />}</button>
            <button onClick={() => props.history.push(path)}>
              <AddChannelIcon />
            </button>
          </div>
        </div>
      </div>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>
      <div className={styles.channelsList}>
        {filteredChannels.length > 0 ? (
          filteredChannels.sort(channelNameSorter).map((channel: Channel) => (
            <div key={channel.id} className={styles.connectedChannel}>
              <ChannelListItem channel={channel} />
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <h1 className={styles.noSearchMatch}>Result not found.</h1>
            <p>Try to search for a different term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(connector(ChannelsList));
