import React, {useEffect, useMemo, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {listChannels} from '../../../actions/channel';
import {useNavigate, useParams} from 'react-router-dom';
import {sortBy} from 'lodash-es';
import {StateModel} from '../../../reducers';
import {allChannels} from '../../../selectors/channels';
import {Channel, ScreenDimensions, Source} from 'model';
import {SearchField} from 'components';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as PlusIcon} from 'assets/images/icons/plus.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import styles from './index.module.scss';
import {
  cyConnectorsAddNewButton,
  cyChannelsChatPluginList,
  cyChannelsFacebookList,
  cyChannelsGoogleList,
  cyChannelsTwilioSmsList,
  cyChannelsTwilioWhatsappList,
  cyChannelsInstagramList,
} from 'handles';
import {
  CONNECTORS_FACEBOOK_ROUTE,
  CONNECTORS_CHAT_PLUGIN_ROUTE,
  CONNECTORS_TWILIO_SMS_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_GOOGLE_ROUTE,
  CONNECTORS_INSTAGRAM_ROUTE,
} from '../../../routes/routes';
import ChannelsListItem from './ChannelsListItem';
import {Pagination} from 'components';
import {useAnimation} from 'render/services/useAnimation';
import {useTranslation} from 'react-i18next';

const mapDispatchToProps = {
  listChannels,
};

const connector = connect(null, mapDispatchToProps);

type ConnectedChannelsListProps = {
  offset?: number;
} & ConnectedProps<typeof connector>;

const ConnectedChannelsList = (props: ConnectedChannelsListProps) => {
  const {listChannels, offset} = props;
  const {source} = useParams();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const channels = useSelector((state: StateModel) => {
    return Object.values(allChannels(state)).filter((channel: Channel) => channel.source === source);
  });

  const [path, setPath] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showingSearchField, setShowingSearchField] = useState(false);
  const [animationAction, setAnimationAction] = useState(false);
  const [dataCyChannelList, setDataCyChannelList] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const screenDimensions: ScreenDimensions = {height: screen.height, width: screen.width};
  const ITEM_LINE_HEIGHT = 64;
  const MARGIN_TOP = 128;
  const PADDING_BOTTOM = 32;
  const PAGINATION_HEIGHT = 54;
  const ADDITIONAL_SPACE = 60;

  const filteredChannels = channels.filter((channel: Channel) =>
    channel.metadata?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const areConnectedChannels = channels.length > 0 && filteredChannels.length > 0;

  const listPageSize = Math.floor(
    (screenDimensions.height - offset - MARGIN_TOP - PAGINATION_HEIGHT - PADDING_BOTTOM - ADDITIONAL_SPACE) /
      ITEM_LINE_HEIGHT
  );

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * listPageSize;
    const lastPageIndex = firstPageIndex + listPageSize;
    return filteredChannels.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, listPageSize, channels.length, filteredChannels.length]);

  useEffect(() => {
    listChannels().catch((error: Error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    getInfo();
  }, [source]);

  const getInfo = () => {
    let ROUTE;
    switch (source) {
      case Source.facebook:
        ROUTE = CONNECTORS_FACEBOOK_ROUTE;
        setPath(ROUTE + '/new');
        setDataCyChannelList(cyChannelsFacebookList);
        break;
      case Source.google:
        ROUTE = CONNECTORS_GOOGLE_ROUTE;
        setPath(ROUTE + '/new');
        setDataCyChannelList(cyChannelsGoogleList);
        break;
      case Source.twilioSMS:
        ROUTE = CONNECTORS_TWILIO_SMS_ROUTE;
        setPath(ROUTE + '/new');
        setDataCyChannelList(cyChannelsTwilioSmsList);
        break;
      case Source.twilioWhatsApp:
        ROUTE = CONNECTORS_TWILIO_WHATSAPP_ROUTE;
        setPath(ROUTE + '/new');
        setDataCyChannelList(cyChannelsTwilioWhatsappList);
        break;
      case Source.chatPlugin:
        ROUTE = CONNECTORS_CHAT_PLUGIN_ROUTE;
        setPath(ROUTE + '/new');
        setDataCyChannelList(cyChannelsChatPluginList);
        break;
      case Source.instagram:
        ROUTE = CONNECTORS_INSTAGRAM_ROUTE;
        setPath(ROUTE + '/new');
        setDataCyChannelList(cyChannelsInstagramList);
        break;
    }
  };

  const showSearchFieldToggle = () => {
    useAnimation(showingSearchField, setShowingSearchField, setAnimationAction, 300);
    setSearchText('');
  };

  return (
    <div className={styles.wrapper}>
      <div style={{display: 'flex', justifyContent: 'flex-end', height: '32px', marginBottom: '16px'}}>
        <div className={styles.searchFieldButtons}>
          <div className={styles.searchField}>
            <div className={animationAction ? styles.animateIn : styles.animateOut}>
              {showingSearchField && (
                <SearchField
                  placeholder={t('search')}
                  value={searchText}
                  setValue={(value: string) => setSearchText(value)}
                  autoFocus={true}
                  style={{height: '32px', borderRadius: '32px'}}
                  resetClicked={() => setSearchText('')}
                />
              )}
            </div>
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
            data-cy={cyConnectorsAddNewButton}
          >
            <PlusIcon className={styles.plusIcon} />
          </button>
        </div>
      </div>
      <div className={styles.columnTitle}>
        <span>{areConnectedChannels ? t('name') : ''}</span>
        <span>{t('manage')}</span>
      </div>
      <div data-cy={dataCyChannelList}>
        {filteredChannels.length > 0 ? (
          sortBy(searchText === '' ? currentTableData : filteredChannels, (channel: Channel) =>
            channel.metadata.name.toLowerCase()
          ).map((channel: Channel) => (
            <div key={channel.id} className={styles.connectedChannel}>
              <ChannelsListItem channel={channel} />
            </div>
          ))
        ) : channels.length > 0 ? (
          <div className={styles.emptyState}>
            <h1 className={styles.noSearchMatch}>{t('noResults')}</h1>
            <p>{t('noResultsTerm')}</p>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h1 className={styles.noChannelsConnected}>{t('noChannelsConnected')}</h1>
          </div>
        )}
      </div>
      {areConnectedChannels && (
        <Pagination
          totalCount={filteredChannels.length}
          pageSize={listPageSize}
          pageCount={filteredChannels.length >= listPageSize ? listPageSize : filteredChannels.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onSearch={searchText !== ''}
        />
      )}
    </div>
  );
};

export default connector(ConnectedChannelsList);
