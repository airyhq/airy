import React, {useEffect, useState} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import {connectFacebookChannel} from '../../../../../actions/channel';
import {StateModel} from '../../../../../reducers';

import {Button, Input, LinkButton, InfoButton} from 'components';
import {ConnectChannelFacebookRequestPayload} from 'httpclient/src';
import {ReactComponent as ArrowLeftIcon} from 'assets/images/icons/arrow-left-2.svg';
import {FacebookLogin} from '../../../FacebookLogin';

import styles from './FacebookConnect.module.scss';

import {CHANNELS_CONNECTED_ROUTE} from '../../../../../routes/routes';

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
  const [errorMessage, setErrorMessage] = useState('');

  const buttonStatus = () => {
    return !(id.length > 5 && token != '');
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

    connectFacebookChannel(connectPayload)
      .then(() => {
        props.history.replace(CHANNELS_CONNECTED_ROUTE + '/facebook');
      })
      .catch(() => {
        setErrorMessage('Please check entered value');
      });
  };

  const fetchFbChannelDataFromFbLoginSDK = (name: string, accessToken: string, pageId: string) => {
    setName(name);
    setToken(accessToken);
    setId(pageId);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>Facebook Messenger</h1>
      <div>
        <FacebookLogin fetchFbChannelDataFromFbLoginSDK={fetchFbChannelDataFromFbLoginSDK} />
        <InfoButton
          link="https://airy.co/docs/core/sources/facebook"
          text="more information about this source"
          color="grey"
        ></InfoButton>

        <LinkButton onClick={props.history.goBack} type="button">
          <ArrowLeftIcon className={styles.backIcon} />
          Back
        </LinkButton>
      </div>
      <div className={styles.inputContainer}>
        <Input
          id="id"
          label="Facebook Page ID"
          placeholder="Add the Facebook Page ID"
          value={id}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setId(event.target.value)}
          minLength={6}
          required={true}
          height={32}
          hint={errorMessage}
          fontClass="font-base"
        />
        <Input
          id="token"
          label="Token"
          placeholder="Add the page Access Token"
          value={token}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToken(event.target.value)}
          required={true}
          height={32}
          hint={errorMessage}
          fontClass="font-base"
        />
        <Input
          id="name"
          label="Name (optional)"
          placeholder="Add a name"
          hint="The standard name will be the same as the Facebook Page"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          height={32}
          fontClass="font-base"
        />
        <Input
          id="image"
          label="Image URL (optional)"
          placeholder="Add an URL"
          hint="The standard picture is the same as the Facebook Page"
          value={image}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setImage(event.target.value)}
          height={32}
          fontClass="font-base"
        />
      </div>
      <Button styleVariant="normal" disabled={buttonStatus()} onClick={() => connectNewChannel()}>
        {buttonTitle}
      </Button>
    </div>
  );
};

export default withRouter(connector(FacebookConnect));
