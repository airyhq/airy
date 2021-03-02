import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import styles from './FacebookConnect.module.scss';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {CHANNELS_ROUTE} from '../../../../routes/routes';
import {Button, Input} from '@airyhq/components';
import {connectChannel} from '../../../../actions/channel';
import {StateModel} from '../../../../reducers';

type FacebookProps = {
  channelId?: string;
} & RouteComponentProps<{channelId: string}> &
  ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel, props: RouteComponentProps<{channelId: string}>) => ({
  channel: state.data.channels[props.match.params.channelId],
});

const connector = connect(mapStateToProps, null);

const FacebookConnect = (props: FacebookProps) => {
  const [id, setId] = useState('');
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [buttonTitle, setButtonTitle] = useState('Connect Page');

  const buttonStatus = () => {
    if (id.length > 5 && token != '') {
      return false;
    } else {
      return true;
    }
  };

  const previousData = () => {
    if (props.match.params.channelId) {
      setId(props.channel.sourceChannelId);
      setName(props.channel.metadata.name);
      setImage(props.channel.metadata.imageUrl);
    }
  };

  useEffect(() => {
    if (props.channel) {
      previousData();
      setButtonTitle('Update Page');
    }
  }, []);

  const connectFacebookPayload = {
    sourceChannelId: id,
    token: token,
    name: name,
    imageUrl: image,
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
          onChange={event => setId(event.target.value)}
          minLength={6}
          required={true}
          height={33}></Input>
        <Input
          id="token"
          label="Token"
          placeholder="Add the page Access Token"
          value={token}
          onChange={event => setToken(event.target.value)}
          required={true}
          height={33}></Input>
        <Input
          id="name"
          label="Name (optional)"
          placeholder="Add a name"
          hint="The standard name will be the same as the Facebook Page"
          value={name}
          onChange={event => setName(event.target.value)}
          height={33}></Input>
        <Input
          id="image"
          label="Image URL (optional)"
          placeholder="Add an URL"
          hint="The standard picture is the same as the Facebook Page"
          value={image}
          onChange={event => setImage(event.target.value)}
          height={33}></Input>
      </div>
      <Button
        styleVariant="normal"
        disabled={buttonStatus()}
        onClick={connectChannel('facebook', connectFacebookPayload)}>
        {buttonTitle}
      </Button>
    </div>
  );
};

export default withRouter(connector(FacebookConnect));
