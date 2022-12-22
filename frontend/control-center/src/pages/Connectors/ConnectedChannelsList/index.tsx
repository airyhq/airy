import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {listChannels} from '../../../actions/channel';
import {useParams} from 'react-router-dom';
import {sortBy} from 'lodash-es';
import {StateModel} from '../../../reducers';
import {allChannels} from '../../../selectors/channels';
import {Channel, ScreenDimensions, Source} from 'model';
import {SearchField, SettingsModal} from 'components';
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
import ChannelsListItem from './ChannelsListItem';
import {Pagination} from 'components';
import {useAnimation} from 'components';
import {useTranslation} from 'react-i18next';
import {ConnectChannelModal} from '../ConnectChannelModal/ConnectChannelModal';

const mapDispatchToProps = {
  listChannels,
};

const connector = connect(null, mapDispatchToProps);

type ConnectedChannelsListProps = {
  offset?: number;
} & ConnectedProps<typeof connector>;

const ConnectedChannelsList = (props: ConnectedChannelsListProps) => {
  const {offset} = props;
  const {source} = useParams();
  const {t} = useTranslation();
  const channels = useSelector((state: StateModel) => {
    return Object.values(allChannels(state)).filter((channel: Channel) => channel.source === source);
  });

  const [searchText, setSearchText] = useState('');
  const [showingSearchField, setShowingSearchField] = useState(false);
  const [animationAction, setAnimationAction] = useState(false);
  const [dataCyChannelList, setDataCyChannelList] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewConnectionModal, setShowNewConnectionModal] = useState(false);
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
    getInfo();
  }, [source]);

  const getInfo = () => {
    switch (source) {
      case Source.facebook:
        setDataCyChannelList(cyChannelsFacebookList);
        break;
      case Source.google:
        setDataCyChannelList(cyChannelsGoogleList);
        break;
      case Source.twilioSMS:
        setDataCyChannelList(cyChannelsTwilioSmsList);
        break;
      case Source.twilioWhatsApp:
        setDataCyChannelList(cyChannelsTwilioWhatsappList);
        break;
      case Source.chatPlugin:
        setDataCyChannelList(cyChannelsChatPluginList);
        break;
      case Source.instagram:
        setDataCyChannelList(cyChannelsInstagramList);
        break;
    }
  };

  const showSearchFieldToggle = useCallback(() => {
    useAnimation(showingSearchField, setShowingSearchField, setAnimationAction, 300);
    setSearchText('');
  }, [showingSearchField, setShowingSearchField]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchFieldContainer}>
        <div className={styles.searchFieldButtons}>
          {showingSearchField && (
            <SearchField
              className={styles.searchField}
              animation={animationAction ? styles.animateIn : styles.animateOut}
              placeholder={t('search')}
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
          <button
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            onClick={() => setShowNewConnectionModal(true)}
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
      {showNewConnectionModal && (
        <SettingsModal
          title={t('createChannel')}
          close={() => setShowNewConnectionModal(false)}
          headerClassName={styles.connectChannelModalHeader}
        >
          <ConnectChannelModal source={source as Source} />
        </SettingsModal>
      )}
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
