import React, {useLayoutEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {sortBy} from 'lodash-es';

import {StateModel} from '../../../reducers';
import {allChannels} from '../../../selectors/channels';

import {Channel, Source} from 'model';
import ChannelsListItem from './ChannelListItem';
import {SearchField, LinkButton, Button} from 'components';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/leftArrowCircle.svg';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as PlusIcon} from 'assets/images/icons/plus.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';

import styles from './index.module.scss';
import {CONNECTORS_ROUTE} from '../../../routes/routes';
import {getChannelAvatar} from '../../../components/ChannelAvatar';
import {useTranslation} from 'react-i18next';

const ChannelsList = () => {
  const {source} = useParams();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const channels = useSelector((state: StateModel) => {
    return Object.values(allChannels(state)).filter((channel: Channel) => channel.source === source);
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [searchText, setSearchText] = useState('');
  const [showingSearchField, setShowingSearchField] = useState(false);
  const connectorsRoute = location.pathname.includes('connectors');

  const filteredChannels = channels.filter((channel: Channel) =>
    channel.metadata?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const path = `${CONNECTORS_ROUTE}/source/new`;

  useLayoutEffect(() => {
    getInfo();
  }, [source, channels]);

  const getInfo = () => {
    switch (source) {
      case Source.facebook:
        setName(t('facebookTitle'));
        setDescription(t('facebookDescription'));
        break;
      case Source.google:
        setName(t('googleTitle'));
        setDescription(t('googleDescription'));
        break;
      case Source.twilioSMS:
        setName(t('twilioSmsTitle'));
        setDescription(t('twilioSmsDescription'));
        break;
      case Source.twilioWhatsApp:
        setName(t('twilioWhatsappTitle'));
        setDescription(t('twilioWhatsappDescription'));
        break;
      case Source.chatPlugin:
        setName(t('chatpluginTitle'));
        setDescription(t('chatpluginDescription'));
        break;
      case Source.instagram:
        setName(t('instagramTitle'));
        setDescription(t('instagramDescription'));
        break;
    }
  };

  const showSearchFieldToggle = () => {
    setShowingSearchField(!showingSearchField);
    setSearchText('');
  };

  return (
    <div className={styles.wrapper}>
      <LinkButton onClick={() => navigate(-1)} type="button">
        <div className={styles.linkButtonContainer}>
          <ArrowLeftIcon className={styles.backIcon} />
          {connectorsRoute ? t('channelsCapital') : ''}
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
        <Button
          style={{width: '152px', height: '40px', fontSize: '16px'}}
          onClick={() => {
            console.log('DISABLE');
          }}
        >
          Disable
        </Button>
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
        <span>{t('name')}</span>
        <span>{t('manage')}</span>
      </div>

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
            <h1 className={styles.noSearchMatch}>{t('noResults')}</h1>
            <p>{t('noResultsTerm')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelsList;
