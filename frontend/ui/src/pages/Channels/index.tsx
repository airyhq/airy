import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {Channel} from 'httpclient';
import {listChannels, exploreChannels, connectChannel, disconnectChannel} from '../../actions/channel';
import {StateModel} from '../../reducers/index';
import styles from './index.module.scss';

import {allChannels} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';
import {ReactComponent as SearchIcon} from '../../assets/images/icons/search.svg';
import {ReactComponent as BackIcon} from '../../assets/images/icons/arrow-left-2.svg';
import {ReactComponent as FilterIcon} from '../../assets/images/icons/filter-alt.svg';
import {ReactComponent as AiryLogo} from '../../assets/images/icons/airy_avatar.svg';
import {ReactComponent as FacebookLogo} from '../../assets/images/icons/messenger_avatar.svg';
import {ReactComponent as SMSLogo} from '../../assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappLogo} from '../../assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as GoogleLogo} from '../../assets/images/icons/google_avatar.svg';
import {ReactComponent as AddChannel} from '../../assets/images/icons/plus-circle.svg';
import {ReactComponent as Placeholder} from '../../assets/images/icons/placeholder.svg';
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

type ChannelsConnectProps = {} & ConnectedProps<typeof connector> & RouteComponentProps;

const Channels = (props: ChannelsConnectProps) => {
  const {channels} = props;
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

  const chatPluginSources = props.channels.filter(channel => channel.source === 'chat_plugin');
  const facebookSources = props.channels.filter(channel => channel.source === 'facebook');

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
        <div className={styles.flexWrap}>
          <div className={styles.airyChannel}>
            <div className={styles.airyLogo}>
              <AiryLogo />
            </div>
            <div className={styles.airyTitleAndText}>
              <p className={styles.airyTitle}>Airy Live Chat</p>
              <p className={styles.airyText}>Best of class browser messenger</p>
            </div>
          </div>
          {channels && chatPluginSources.length === 0 && (
            <div className={styles.channelButton}>
              <button type="button" className={styles.addChannelButton}>
                <div className={styles.channelButtonIcon}>
                  <AddChannel />
                </div>
              </button>
            </div>
          )}

          {channels && chatPluginSources.length > 0 && (
            <>
              <div className={styles.airyConnectedContainer}>
                <div className={styles.airyConnectedSum}>
                  <p>{chatPluginSources.length} CONNECTED</p>
                </div>

                <div className={styles.airyConnectedChannel}>
                  {chatPluginSources.map((channel: Channel) => {
                    const channelName = channel.metadata.name;
                    return (
                      <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                        {channel.metadata.imageUrl && (
                          <img src={channel.metadata.imageUrl} alt={channelName} className={styles.channelImage} />
                        )}
                        <div className={styles.namePlaceholder}>
                          <div className={styles.placeholderLogo}>
                            <Placeholder />{' '}
                          </div>

                          <div className={styles.channelName}>{channel.metadata.name}</div>
                        </div>
                      </li>
                    );
                  })}
                </div>
              </div>
              <div className={styles.channelButton}>
                <button type="button" className={styles.addChannelButton}>
                  <div className={styles.channelButtonIcon}>
                    <AddChannel />
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        <div className={styles.flexWrap}>
          <div className={styles.facebookChannel}>
            <div className={styles.facebookLogo}>
              <FacebookLogo />
            </div>
            <div className={styles.facebookTitleAndText}>
              <p className={styles.facebookTitle}>Messenger</p>
              <p className={styles.facebookText}>Connect multiple Facebook pages</p>
            </div>
          </div>
          {channels && facebookSources.length === 0 && (
            <div className={styles.channelButton}>
              <button type="button" className={styles.addChannelButton}>
                <div className={styles.channelButtonIcon}>
                  <AddChannel />
                </div>
              </button>
            </div>
          )}

          {channels && facebookSources.length > 0 && (
            <>
              <div className={styles.airyConnectedContainer}>
                <div className={styles.airyConnectedSum}>
                  <p>{facebookSources.length} CONNECTED</p>
                </div>

                <div className={styles.airyConnectedChannel}>
                  {facebookSources.map((channel: Channel) => {
                    // const channelName = channel.metadata.name;
                    return (
                      <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                        {/* {channel.metadata.imageUrl && (
                          <img src={channel.metadata.imageUrl} alt={channelName} className={styles.channelImage} />
                        )} */}
                        <div className={styles.channelName}>{channel.metadata.name}</div>
                      </li>
                    );
                  })}
                </div>
              </div>
              <div className={styles.channelButton}>
                <button type="button" className={styles.addChannelButton}>
                  <div className={styles.channelButtonIcon}>
                    <AddChannel />
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
        <div className={styles.flexWrap}>
          <div className={styles.smsChannel}>
            <div className={styles.smsLogo}>
              <SMSLogo />
            </div>
            <div className={styles.smsTitleAndText}>
              <p className={styles.smsTitle}>SMS</p>
              <p className={styles.smsText}>Deliver SMS with ease</p>
            </div>
          </div>
          <div>
            <div className={styles.channelButton}>
              <button type="button" className={styles.addChannelButton}>
                <div className={styles.channelButtonIcon}>
                  <AddChannel />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.flexWrap}>
          <div className={styles.whatsappChannel}>
            <div className={styles.whatsappLogo}>
              <WhatsappLogo />
            </div>
            <div className={styles.whatsappTitleAndText}>
              <p className={styles.whatsappTitle}>Whatsapp</p>
              <p className={styles.whatsappText}>World #1 chat app</p>
            </div>
          </div>
          <div>
            <div className={styles.channelButton}>
              <button type="button" className={styles.addChannelButton}>
                <div className={styles.channelButtonIcon}>
                  <AddChannel />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.flexWrap}>
          <div className={styles.googleChannel}>
            <div className={styles.googleLogo}>
              <GoogleLogo />
            </div>
            <div className={styles.googleTitleAndText}>
              <p className={styles.googleTitle}>Google Business Messages</p>
              <p className={styles.googleText}>Be there when people search</p>
            </div>
          </div>
          <div>
            <div className={styles.channelButton}>
              <button type="button" className={styles.addChannelButton}>
                <div className={styles.channelButtonIcon}>
                  <AddChannel />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(Channels);
