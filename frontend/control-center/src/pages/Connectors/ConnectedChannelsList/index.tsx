import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {sortBy} from 'lodash-es';

import {StateModel} from '../../../reducers';
import {allChannels} from '../../../selectors/channels';

import {Channel, Source} from 'model';
import ChannelsListItem from './ChannelsListItem';
import {SearchField, LinkButton} from 'components';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/arrowLeft.svg';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as PlusIcon} from 'assets/images/icons/plus.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';
import {cyChannelsFormBackButton} from 'handles';
import {
  CONNECTORS_FACEBOOK_ROUTE,
  CONNECTORS_CHAT_PLUGIN_ROUTE,
  CONNECTORS_TWILIO_SMS_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_GOOGLE_ROUTE,
  CONNECTORS_INSTAGRAM_ROUTE,
  CATALOG_FACEBOOK_ROUTE,
  CATALOG_CHAT_PLUGIN_ROUTE,
  CATALOG_TWILIO_SMS_ROUTE,
  CATALOG_TWILIO_WHATSAPP_ROUTE,
  CATALOG_GOOGLE_ROUTE,
  CATALOG_INSTAGRAM_ROUTE,
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
    getInfo();
  }, [source, channels]);

  const getInfo = () => {
    let ROUTE;
    switch (source) {
      case Source.facebook:
        setName('Facebook Messenger');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_FACEBOOK_ROUTE : CATALOG_FACEBOOK_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.google:
        setName('Google Business Messages');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_GOOGLE_ROUTE : CATALOG_GOOGLE_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.twilioSMS:
        setName('Twilio SMS');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_TWILIO_SMS_ROUTE : CATALOG_TWILIO_SMS_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.twilioWhatsApp:
        setName('Twilio Whatsapp');
        ROUTE = location.pathname.includes('connectors')
          ? CONNECTORS_TWILIO_WHATSAPP_ROUTE
          : CATALOG_TWILIO_WHATSAPP_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.chatPlugin:
        setName('Chat Plugin');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_CHAT_PLUGIN_ROUTE : CATALOG_CHAT_PLUGIN_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.instagram:
        setName('Instagram');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_INSTAGRAM_ROUTE : CATALOG_INSTAGRAM_ROUTE;
        setPath(ROUTE + '/new');
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

      <LinkButton dataCy={cyChannelsFormBackButton} onClick={() => navigate(-1)} type="button">
        <ArrowLeftIcon className={styles.backIcon} />
        Back
      </LinkButton>

      <div className={styles.channelsList}>
        {filteredChannels.length > 0 ? (
          sortBy(filteredChannels, (channel: Channel) => channel.metadata.name.toLowerCase()).map(
            (channel: Channel) => (
              <div key={channel.id} className={styles.connectedChannel}>
                <ChannelsListItem channel={channel} />
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
