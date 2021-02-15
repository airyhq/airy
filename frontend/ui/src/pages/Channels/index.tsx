import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {listChannels, exploreChannels, connectChannel, disconnectChannel} from '../../actions/channel';
import {StateModel} from '../../reducers/index';
import styles from './index.module.scss';

import {allChannels} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';
import {ReactComponent as SearchIcon} from '../../assets/images/icons/search.svg';
import {ReactComponent as BackIcon} from '../../assets/images/icons/arrow-left-2.svg';
import {ReactComponent as FilterIcon} from '../../assets/images/icons/filter-alt.svg';
import {SearchField} from '@airyhq/components';
import ChatPluginSource from '../Channels/ChannelsSources/ChatPluginSource';
import FacebookSource from '../Channels/ChannelsSources/FacebookSource';
import TwilloSmsSource from '../Channels/ChannelsSources/TwilloSmsSource';
import WhatsappSmsSource from '../Channels/ChannelsSources/WhatsappSmsSource';
import GoogleSource from '../Channels/ChannelsSources/GoogleSource';

const mapDispatchToProps = {
  listChannels,
  exploreChannels,
  connectChannel,
  disconnectChannel,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ChannelsConnectProps = {} & ConnectedProps<typeof connector> & RouteComponentProps;

const Channels = (props: ChannelsConnectProps) => {
  const [isShowingSearchChannelInput, setIsShowingSearchChannelInput] = useState(false);
  const [searchChannel, setSearchChannel] = useState('');

  const onClickSearch = () => {
    setIsShowingSearchChannelInput(!isShowingSearchChannelInput);
  };

  const onClickBack = () => {
    setIsShowingSearchChannelInput(!isShowingSearchChannelInput);
    setSearchChannel('');
  };

  const setValue = (value: string) => {
    setSearchChannel(value);
  };

  useEffect(() => {
    props.listChannels();
    setPageTitle('Channels');
  }, []);

  const renderSearchChannelInput = isShowingSearchChannelInput ? (
    <div className={styles.containerChannelSearchField}>
      <button type="button" className={styles.backButton} onClick={onClickBack}>
        <BackIcon className={styles.backIcon} />
      </button>
      <div className={styles.channelSearchFieldWidth}>
        <SearchField
          placeholder="Search"
          value={searchChannel}
          setValue={setValue}
          resetClicked={onClickSearch}
          autoFocus={true}
        />
      </div>
    </div>
  ) : (
    <div className={styles.containerChannelSearchHeadline}>
      <div className={styles.searchBox}>
        <button type="button" className={styles.searchButton} onClick={onClickSearch}>
          <SearchIcon className={styles.searchIcon} title="Search" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.channelsWrapper}>
      <div className={styles.channelsHeadline}>
        <div>
          <h1 className={styles.channelsHeadlineText}>Channels</h1>
        </div>
        <div className={styles.containerFilterAndSearchChannel}>
          <div className={styles.containerFilter}>
            <button type="button" className={styles.searchButton} onClick={onClickSearch} disabled={true}>
              <FilterIcon className={styles.searchIcon} title="Filter" />
            </button>
          </div>
          {renderSearchChannelInput}
        </div>
      </div>
      <div className={styles.channelsChoice}>
        {' '}
        <p>Choose a channel you want to connect</p>
      </div>

      <div className={styles.wrapper}>
        <ChatPluginSource pluginSource={props.channels} />
        <FacebookSource facebookSource={props.channels} />
        <TwilloSmsSource twilloSmsSource={props.channels} />
        <WhatsappSmsSource whatsappSmsSource={props.channels} />
        <GoogleSource googleSource={props.channels} />
      </div>
    </div>
  );
};

export default connector(Channels);
