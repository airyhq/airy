import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {CHANNELS_FACEBOOK_ROUTE, CHANNELS_CHAT_PLUGIN_ROUTE, CHANNELS_ROUTE} from './../../../routes/routes';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {ReactComponent as FilterIcon} from 'assets/images/icons/filter-alt.svg';
import {ReactComponent as SearchIcon} from 'assets/images/icons/search.svg';
import {ReactComponent as AddChannelIcon} from 'assets/images/icons/plus.svg';
import {StateModel} from './../../../reducers';
import {Channel} from 'httpclient';
import {allChannels} from './../../../selectors/channels';
import {ChannelSource} from 'httpclient';
import ChannelListItem from './ChannelListItem';
import styles from './ChannelsList.module.scss';

type ChannelsListProps = {} & ConnectedProps<typeof connector> & RouteComponentProps<{source: string}>;

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
});

const connector = connect(mapStateToProps, null);

const ChannelsList = (props: ChannelsListProps) => {
  const {channels} = props;
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const source = props.match.params.source;

  useEffect(() => {
    setPageTitle();
  }, [source]);

  const setPageTitle = () => {
    switch (source) {
      case ChannelSource.facebook:
        setName('Facebook');
        setPath(CHANNELS_FACEBOOK_ROUTE);
        break;
      case ChannelSource.google:
        setName('Google');
        setPath('');
        break;
      case ChannelSource.twilioSMS:
        setName('Twilio SMS');
        setPath('');
        break;
      case ChannelSource.twilioWhatsapp:
        setName('Twilio Whatsapp');
        setPath('');
        break;
      case ChannelSource.chatPlugin:
        setName('Chat Plugin');
        setPath(CHANNELS_CHAT_PLUGIN_ROUTE);
        break;
    }
  };

  const filteredChannels = channels.filter((channel: Channel) => channel.source === source);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headlineRow}>
        <h1 className={styles.headline}>{name}</h1>
        <div className={styles.buttons}>
          <button>
            <FilterIcon />
          </button>
          <button>
            <SearchIcon />
          </button>
          <button onClick={() => props.history.push(path)}>
            <AddChannelIcon />
          </button>
        </div>
      </div>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>
      <div className={styles.channelsList}>
        {filteredChannels &&
          filteredChannels.map((channel: Channel) => (
            <div key={channel.id} className={styles.connectedChannel}>
              <ChannelListItem channel={channel} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default withRouter(connector(ChannelsList));
