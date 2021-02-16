/* global FB */
import React, {useCallback, useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import {Button} from '@airyhq/components';

import {Channel} from 'httpclient';
import {AiryConfig} from '../../AiryConfig';
import {listChannels, exploreChannels, connectChannel, disconnectChannel} from '../../actions/channel';
import {StateModel} from '../../reducers';

import styles from './index.module.scss';
import {setPageTitle} from '../../services/pageTitle';

const mapDispatchToProps = {
  listChannels,
  exploreChannels,
  connectChannel,
  disconnectChannel,
};

const mapStateToProps = (state: StateModel) => {
  return {
    channels: state.data.channels,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ChannelsConnectProps = {} & ConnectedProps<typeof connector> & RouteComponentProps;

const Channels = (props: ChannelsConnectProps) => {
  const [facebookToken, setFacebookToken] = useState('');
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
    props.disconnectChannel('facebook', {channelId: channel.sourceChannelId});
  };

  return (
    <div className={styles.channelsWrapper}>
      <div className={styles.headline}>
        <h1 className={styles.headlineText}>Channels</h1>
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
        />
      </div>
      <ul className={styles.channelList}>
        {props.channels.map((channel: Channel) => {
          const channelName = channel.metadata.name;
          return (
            <li key={channel.sourceChannelId} className={styles.channelListEntry}>
              {channel.metadata.imageUrl && (
                <img src={channel.metadata.imageUrl} alt={channelName} className={styles.channelImage} />
              )}
              <div className={styles.channelName}>{channel.metadata.name}</div>
              <div className={styles.channelAction}>
                {channel.connected ? (
                  <Button styleVariant="small" onClick={() => disconnectClicked(channel)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button styleVariant="small" onClick={() => connectClicked(channel)}>
                    Connect
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default connector(Channels);
