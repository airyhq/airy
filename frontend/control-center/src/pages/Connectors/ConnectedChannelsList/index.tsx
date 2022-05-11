import React, {useLayoutEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {sortBy} from 'lodash-es';

import {StateModel} from '../../../reducers';
import {allChannels} from '../../../selectors/channels';

import {Channel, Source} from 'model';

import {SearchField, LinkButton} from 'components';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
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
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import ChannelsListItem from './ChannelsListItem';
import {Pagination} from '../../../components/Pagination';

const ConnectedChannelsList = () => {
  const {source} = useParams();
  const navigate = useNavigate();
  const channels = useSelector((state: StateModel) => {
    return Object.values(allChannels(state)).filter((channel: Channel) => channel.source === source);
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [path, setPath] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showingSearchField, setShowingSearchField] = useState(false);

  const filteredChannels = channels.filter((channel: Channel) =>
    channel.metadata?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const pageSize = filteredChannels.length >= 8 ? 8 : filteredChannels.length;
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return filteredChannels.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pageSize]);

  useLayoutEffect(() => {
    getInfo();
  }, [source, channels]);

  const getInfo = () => {
    let ROUTE;
    switch (source) {
      case Source.facebook:
        setName('Facebook Messenger');
        setDescription('Connect multiple Facebook pages');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_FACEBOOK_ROUTE : CATALOG_FACEBOOK_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.google:
        setName('Google Business Messages');
        setDescription('Be there when people search');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_GOOGLE_ROUTE : CATALOG_GOOGLE_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.twilioSMS:
        setName('Twilio SMS');
        setDescription('Deliver SMS with ease');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_TWILIO_SMS_ROUTE : CATALOG_TWILIO_SMS_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.twilioWhatsApp:
        setName('Twilio Whatsapp');
        setDescription('World #1 chat app');
        ROUTE = location.pathname.includes('connectors')
          ? CONNECTORS_TWILIO_WHATSAPP_ROUTE
          : CATALOG_TWILIO_WHATSAPP_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.chatPlugin:
        setName('Chat Plugin');
        setDescription('Best of class browser messenger');
        ROUTE = location.pathname.includes('connectors') ? CONNECTORS_CHAT_PLUGIN_ROUTE : CATALOG_CHAT_PLUGIN_ROUTE;
        setPath(ROUTE + '/new');
        break;
      case Source.instagram:
        setName('Instagram');
        setDescription('Connect multiple Instagram pages');
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
      <LinkButton dataCy={cyChannelsFormBackButton} onClick={() => navigate(-1)} type="button">
        <div className={styles.linkButtonContainer}>
          <ArrowLeftIcon className={styles.backIcon} />
          Channels
        </div>
      </LinkButton>
      <div className={styles.headlineRow}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div style={{height: '64px', width: '64px'}}>{getChannelAvatar(source)}</div>
          <div style={{display: 'flex', flexDirection: 'column', marginLeft: '16px'}}>
            <h1 className={styles.headline}>{name}</h1>
            <h2 className={styles.description}>{description}</h2>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end', height: '32px', marginBottom: '16px'}}>
        <div className={styles.searchFieldButtons}>
          <div className={styles.searchField}>
            {showingSearchField && (
              <SearchField
                placeholder="Search"
                value={searchText}
                setValue={(value: string) => setSearchText(value)}
                autoFocus={true}
                style={{height: '32px', borderRadius: '32px'}}
                resetClicked={() => setSearchText('')}
              />
            )}
          </div>
        </div>
        <div className={styles.buttons}>
          <button onClick={showSearchFieldToggle}>
            {showingSearchField ? (
              <CloseIcon className={styles.closeIcon} />
            ) : (
              <SearchIcon className={styles.searchIcon} />
            )}
          </button>
          <button
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={() => navigate(path)}
          >
            <PlusIcon className={styles.plusIcon} />
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          fontWeight: '700',
          fontSize: '16px',
          marginBottom: '24px',
        }}
      >
        <span>Name</span>
        <span>Manage</span>
      </div>
      <div className={styles.channelsList}>
        {filteredChannels.length > 0 ? (
          sortBy(searchText === '' ? currentTableData : filteredChannels, (channel: Channel) =>
            channel.metadata.name.toLowerCase()
          ).map((channel: Channel) => (
            <div key={channel.id} className={styles.connectedChannel}>
              <ChannelsListItem channel={channel} />
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <h1 className={styles.noSearchMatch}>Result not found.</h1>
            <p>Try to search for a different term.</p>
          </div>
        )}
      </div>
      <Pagination
        totalCount={filteredChannels.length}
        pageCount={filteredChannels.length >= pageSize ? pageSize : filteredChannels.length}
        currentPage={currentPage}
        onPageChange={page => setCurrentPage(page)}
        onSearch={searchText !== ''}
      />
    </div>
  );
};

export default ConnectedChannelsList;
