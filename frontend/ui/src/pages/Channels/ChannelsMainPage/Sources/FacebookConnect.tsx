import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import styles from './FacebookConnect.module.scss';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {CHANNELS_CONNECTED_ROUTE, CHANNELS_ROUTE} from '../../../../routes/routes';
import {Button, Input} from '@airyhq/components';
import {connectFacebookChannel} from '../../../../actions/channel';
import {StateModel} from '../../../../reducers';
import {Channel, ConnectChannelFacebookRequestPayload} from 'httpclient';

type FacebookProps = {
  channelId?: string;
} & RouteComponentProps<{channelId: string}> &
  ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel, props: RouteComponentProps<{channelId: string}>) => ({
  channel: state.data.channels[props.match.params.channelId],
});

const mapDispatchToProps = {
  connectFacebookChannel,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const FacebookConnect = (props: FacebookProps) => {
  const {connectFacebookChannel, channel} = props;
  const [id, setId] = useState(channel?.sourceChannelId || '');
  const [token, setToken] = useState('');
  const [name, setName] = useState(channel?.metadata?.name || '');
  const [image, setImage] = useState(channel?.metadata?.imageUrl || '');
  const [buttonTitle, setButtonTitle] = useState('Connect Page');

  const buttonStatus = () => {
    if (id.length > 5 && token != '') {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (channel) {
      setButtonTitle('Update Page');
    }
  }, []);

  const connectNewChannel = () => {
    const connectPayload: ConnectChannelFacebookRequestPayload = {
      pageId: id,
      pageToken: token,
      ...(name &&
        name !== '' && {
          name,
        }),
      ...(image &&
        image !== '' && {
          imageUrl: image,
        }),
    };

    connectFacebookChannel(connectPayload).then((response: Channel) => {
      props.history.replace(CHANNELS_CONNECTED_ROUTE + '/facebook');
    });
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>Facebook Messenger</h1>
      <Link to={CHANNELS_ROUTE} className={styles.backButton}>
        <BackIcon className={styles.backIcon} />
        Back to channels
      </Link>
      <div className={styles.inputContainer}>
        <Input
          id="id"
          label="Facebook Page ID"
          placeholder="Add the Facebook Page ID"
          value={id}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setId(event.target.value)}
          minLength={6}
          required={true}
          height={33}></Input>
        <Input
          id="token"
          label="Token"
          placeholder="Add the page Access Token"
          value={token}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToken(event.target.value)}
          required={true}
          height={33}></Input>
        <Input
          id="name"
          label="Name (optional)"
          placeholder="Add a name"
          hint="The standard name will be the same as the Facebook Page"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          height={33}></Input>
        <Input
          id="image"
          label="Image URL (optional)"
          placeholder="Add an URL"
          hint="The standard picture is the same as the Facebook Page"
          value={image}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setImage(event.target.value)}
          height={33}></Input>
      </div>
      <Button styleVariant="normal" disabled={buttonStatus()} onClick={() => connectNewChannel()}>
        {buttonTitle}
      </Button>
    </div>
  );
};

export default withRouter(connector(FacebookConnect));
