import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import styles from './FacebookChannelsList.module.scss';
import {CHANNELS_ROUTE} from './../../../routes/routes';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {ReactComponent as CheckMark} from 'assets/images/icons/checkmark.svg';
import {exploreChannels} from './../../../actions/channel';
import {StateModel} from './../../../reducers';
import {Channel} from 'httpclient';
import {allChannels} from './../../../selectors/channels';
import {Button} from '@airyhq/components';

type FacebookConnectedProps = {} & ConnectedProps<typeof connector> & RouteComponentProps;

const mapStateToProps = (state: StateModel) => ({
  token: state.data.user.token,
  channels: Object.values(allChannels(state)),
});

const connector = connect(mapStateToProps, null);

const FacebookChannelsList = (props: FacebookConnectedProps) => {
  const {token, channels} = props;

  const ExploreChannelRequestPayload = {
    token: token,
  };

  useEffect(() => {
    exploreChannels(ExploreChannelRequestPayload);
  }, [token]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>Facebook Messenger</h1>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>
      <div className={styles.connectedChannels}>
        {channels.map((channel: Channel) => {
          <div className={styles.channelRow}>
            <img src={channel.metadata.imageUrl} />
            <p>{channel.metadata.name}</p>
            {channel.connected && (
              <div className={styles.connectedHint}>
                Connected <CheckMark />
              </div>
            )}
            <div className={styles.channelRowEdit}>
              <Button styleVariant="text">Edit</Button>
            </div>
            <br />
          </div>;
        })}
      </div>
      {/* <Button styleVariant="normal" disabled={buttonStatus()} onClick={connectChannelFacebook(connectFacebookPayload)}>
          Connect Page
        </Button> */}
    </div>
  );
};

export default withRouter(connector(FacebookChannelsList));
