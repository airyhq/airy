import React, {useCallback, useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import {Button} from '@airyhq/components';
import ChannelItems from './ChannelItems';
import {Channel} from 'httpclient';
import {AiryConfig} from '../../AiryConfig';
import {listChannels, exploreChannels, connectChannel, disconnectChannel} from '../../actions/channel';
import {StateModel} from '../../reducers/index';
import styles from './index.module.scss';

import {allChannels} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';
import {ReactComponent as SearchIcon} from '../../assets/images/icons/search.svg';
import {ReactComponent as BackIcon} from '../../assets/images/icons/arrow-left-2.svg';
import {ReactComponent as FilterIcon} from '../../assets/images/icons/filter-alt.svg';
import {SearchField} from '@airyhq/components';

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

const Channels = (props: ConnectedProps<typeof connector>) => {
  const [facebookToken, setFacebookToken] = useState('');

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

  const connect = (token: string) => {
    props.exploreChannels({
      source: 'facebook',
      token,
    });
  };

  const fetchPages = () => {
    FB.getLoginStatus(loginResponse => {
      if (loginResponse.status === 'connected') {
        setFacebookToken(loginResponse.authResponse.accessToken);
        connect(loginResponse.authResponse.accessToken);
      } else {
        FB.login(loginResponse => {
          setFacebookToken(loginResponse.authResponse.accessToken);
          connect(loginResponse.authResponse.accessToken);
        });
      }
    });
  };

  const connectClicked = useCallback(
    (channel: Channel) => {
      props.connectChannel({
        source: channel.source,
        sourceChannelId: channel.sourceChannelId,
        token: facebookToken,
      });
    },
    [facebookToken]
  );

  const disconnectClicked = (channel: Channel) => {
    props.disconnectChannel({channelId: channel.sourceChannelId});
  };

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
      <div className={styles.headline}>
        <div>
          <h1 className={styles.headlineText}>Channels</h1>
        </div>
        <FacebookLogin
          appId={AiryConfig.FACEBOOK_APP_ID}
          autoLoad={false}
          textButton="Add a Channel"
          fields="name,email,picture"
          scope="pages_messaging,pages_show_list,manage_pages"
          callback={fetchPages}
          version="3.2"
          cssClass={styles.connectButton}
          render={() => (
            <Button type="button" onClick={fetchPages}>
              Add Channels
            </Button>
          )}
        />{' '}
        */}
      </div>
      <ul className={styles.channelChoice}>
        {' '}
        <li>Choose a channel you want to connect</li>
      </ul>
      <div>
        <ChannelItems />
      </div>
    </div>
  );
};

export default connector(Channels);
