import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import {Channel} from 'httpclient';
//import {AiryConfig} from '../../AiryConfig';
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

  const handleAiryChannel = () => {
    //Enter logic here
  };
  const handleFacebookChannel = () => {
    //Enter logic here
  };
  const handleSmsChannel = () => {
    //Enter logic here
  };
  const handleWhatsappChannel = () => {
    //Enter logic here
  };
  const handleGoogleChannel = () => {
    //Enter logic here
  };

  const totalChannel = props.channels.length;

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
  console.log(props.channels);
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
      <ul className={styles.channelsChoice}>
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
          {Channels && props.channels.length === 0 && (
            <div className={styles.channelButton}>
              <button type="button" onClick={handleAiryChannel} className={styles.addChannelButton}>
                <div className={styles.channelButtonIcon}>
                  <AddChannel />
                </div>
              </button>
            </div>
          )}

          {Channels && props.channels.length > 0 && (
            <>
              <div className={styles.airyConnectedContainer}>
                <div className={styles.airyConnectedPara}>
                  <p>{totalChannel} CONNECTED</p>
                </div>

                <div className={styles.airyConnectedChannel}>
                  {props.channels.map((channel: Channel) => (
                    <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                      <img src={channel.imageUrl} className={styles.channelImage} />
                      <div className={styles.channelName}>{channel.name}</div>
                    </li>
                  ))}
                </div>
              </div>
              <div className={styles.channelButton}>
                <button type="button" onClick={handleAiryChannel} className={styles.addChannelButton}>
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
          {Channels && props.channels.length === 0 && (
            <div className={styles.channelButton}>
              <button type="button" onClick={handleFacebookChannel} className={styles.addChannelButton}>
                <div className={styles.channelButtonIcon}>
                  <AddChannel />
                </div>
              </button>
            </div>
          )}

          {Channels && props.channels.length > 0 && (
            <>
              <div className={styles.airyConnectedContainer}>
                <div className={styles.airyConnectedPara}>
                  <p>{totalChannel} CONNECTED</p>
                </div>

                <div className={styles.airyConnectedChannel}>
                  {props.channels.map((channel: Channel) => (
                    <li key={channel.sourceChannelId} className={styles.channelListEntry}>
                      <img src={channel.imageUrl} className={styles.channelImage} />
                      <div className={styles.channelName}>{channel.name}</div>
                      <div className={styles.channelAction}></div>
                    </li>
                  ))}
                </div>
              </div>
              <div className={styles.channelButton}>
                <button type="button" onClick={handleAiryChannel} className={styles.addChannelButton}>
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
              <button type="button" onClick={handleSmsChannel} className={styles.addChannelButton}>
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
              <button type="button" onClick={handleWhatsappChannel} className={styles.addChannelButton}>
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
              <button type="button" onClick={handleGoogleChannel} className={styles.addChannelButton}>
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
