import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {sortBy} from 'lodash-es';

import {StateModel} from '../../../reducers';
import {allChannels} from '../../../selectors/channels';

import {Channel, Source} from 'model';
import ChannelListItem from './ChannelListItem';
import {SearchField} from 'components';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/arrowLeft.svg';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as PlusIcon} from 'assets/images/icons/plus.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';
import {cyChannelsFormBackButton} from 'handles';
import {
  CHANNELS_FACEBOOK_ROUTE,
  CHANNELS_CHAT_PLUGIN_ROUTE,
  CHANNELS_ROUTE,
  CHANNELS_TWILIO_SMS_ROUTE,
  CHANNELS_TWILIO_WHATSAPP_ROUTE,
  CHANNELS_GOOGLE_ROUTE,
  CHANNELS_INSTAGRAM_ROUTE,
} from '../../../routes/routes';

const ConnectedChannelsList = () => {
  const {source} = useParams();
  const navigate = useNavigate();
  const channels = useSelector((state: StateModel) => {
    return Object.values(allChannels(state)).filter((channel: Channel) => channel.source === source);
  });

  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showingSearchField, setShowingSearchField] = useState(false);

  const filteredChannels = channels.filter((channel: Channel) =>
    channel.metadata?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    setPageTitle();
  }, [source, channels]);

  const setPageTitle = () => {
    switch (source) {
      case Source.facebook:
        setName('Facebook Messenger');
        setPath(CHANNELS_FACEBOOK_ROUTE + '/new');
        break;
      case Source.google:
        setName('Google Business Messages');
        setPath(CHANNELS_GOOGLE_ROUTE + '/new_account');
        break;
      case Source.twilioSMS:
        setName('Twilio SMS');
        setPath(CHANNELS_TWILIO_SMS_ROUTE + '/new_account');
        break;
      case Source.twilioWhatsApp:
        setName('Twilio Whatsapp');
        setPath(CHANNELS_TWILIO_WHATSAPP_ROUTE + '/new_account');
        break;
      case Source.chatPlugin:
        setName('Chat Plugin');
        setPath(CHANNELS_CHAT_PLUGIN_ROUTE + '/new');
        break;
      case Source.instagram:
        setName('Instagram');
        setPath(CHANNELS_INSTAGRAM_ROUTE + '/new');
        break;
    }
  };

  const showSearchFieldToggle = () => {
    setShowingSearchField(!showingSearchField);
    setSearchText('');
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
            <button onClick={showSearchFieldToggle}>
              {showingSearchField ? (
                <CloseIcon className={styles.closeIcon} />
              ) : (
                <SearchIcon className={styles.searchIcon} />
              )}
            </button>
            <button onClick={() => navigate(path)}>
              <PlusIcon className={styles.plusIcon} />
            </button>
          </div>
        </div>
      </div>

      <Link to={CHANNELS_ROUTE} className={styles.backButton} data-cy={cyChannelsFormBackButton}>
        <ArrowLeftIcon className={styles.backIcon} />
        Back to channels
      </Link>

      <div className={styles.channelsList}>
        {filteredChannels.length > 0 ? (
          sortBy(filteredChannels, (channel: Channel) => channel.metadata.name.toLowerCase()).map(
            (channel: Channel) => (
              <div key={channel.id} className={styles.connectedChannel}>
                <ChannelListItem channel={channel} />
              </div>
            )
          )
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

export default ConnectedChannelsList;
