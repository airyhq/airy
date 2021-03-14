import React, {useState, useEffect} from 'react';
import styles from './TwilioSmsConnect.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {LinkButton} from '@airyhq/components';
import {ReactComponent as BackIcon} from 'assets/images/icons/arrow-left-2.svg';
import {ReactComponent as SMSLogo} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as CheckMark} from 'assets/images/icons/checkmark.svg';
import {Channel} from 'httpclient';
import {CHANNELS_CONNECTED_ROUTE, CHANNELS_TWILIO_SMS_ROUTE} from '../../../../routes/routes';
import {connectTwilioSms, disconnectChannel} from '../../../../actions/channel';
import {StateModel} from '../../../../reducers';
import {allChannels} from '../../../../selectors/channels';
import SmsWhatsappForm from '../SourcesRequirement/SmsWhatsappForm';

interface TwilioSmsRouterProps {
  channelId?: string;
}

const mapDispatchToProps = {connectTwilioSms, disconnectChannel};
const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannels(state)),
  twilioSmsSource: Object.values(allChannels(state)).filter((channel: Channel) => channel.source === 'twilio.sms'),
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type TwilioSmsProps = {} & ConnectedProps<typeof connector> & RouteComponentProps<TwilioSmsRouterProps>;

const TwilioSmsConnect = (props: TwilioSmsProps) => {
  const [smsNumberInput, setSmsNumberInput] = useState('');
  const [smsNameInput, setSmsNameInput] = useState('');
  const [smsUrlInput, setSmsUrlInput] = useState('');
  const channelId = props.match.params.channelId;

  useEffect(() => {
    if (channelId !== 'new_account' && channelId?.length) {
      const channel = props.channels.find((channel: Channel) => {
        return channel.id === channelId;
      });
      if (channel) {
        setSmsNumberInput(channel.sourceChannelId || '');
        setSmsUrlInput(channel.metadata.imageUrl || '');
        setSmsNameInput(channel.metadata.name || '');
      }
    }
  }, [props.channels, channelId]);

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSmsNumberInput(e.target.value);
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSmsNameInput(e.target.value);
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSmsUrlInput(e.target.value);
  };

  const sendTwilioSmsData = () => {
    props
      .connectTwilioSms({
        sourceChannelId: smsNumberInput,
        name: smsNameInput,
        imageUrl: smsUrlInput,
      })
      .then(() => {
        props.history.replace({
          pathname: CHANNELS_CONNECTED_ROUTE + `/twilio.sms/#`,
          state: {source: 'twilio.sms'},
        });
      });
  };

  const connectTwilioSms = (e: React.ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sendTwilioSmsData();
  };

  const showTwilioSmsForm = () => (
    <SmsWhatsappForm
      connectTwilioSms={connectTwilioSms}
      twilioPhoneNumber="Twilio Phone Number"
      placeholder="Purchased Number +158129485394"
      name="name"
      text="text"
      twilioNumberInput={smsNumberInput}
      handleNumberInput={handleNumberInput}
      imageUrl="Image URL (optional)"
      urlPlaceholder="Add an URL"
      urlName="url"
      urlText="url"
      twilioUrlInput={smsUrlInput}
      handleUrlInput={handleUrlInput}
      accountName="Add a Name (optional)"
      namePlaceholder="SMS Acme Berlin"
      twilioNameInput={smsNameInput}
      handleNameInput={handleNameInput}
    />
  );

  const disconnectChannel = (channel: Channel) => {
    if (window.confirm('Do you really want to delete this channel?')) {
      props.disconnectChannel('twilio.sms', {channelId: channel.id});
    }
  };

  const renderOverviewPage = () => (
    <div className={styles.overview}>
      <ul>
        {props.twilioSmsSource.map((channel: Channel) => (
          <li key={channel.id} className={styles.listItem}>
            <div className={styles.channelLogo}>
              {channel.metadata?.imageUrl && (
                <div className={styles.placeholderLogo}>
                  <SMSLogo />{' '}
                </div>
              )}
            </div>
            <div className={styles.listChannelName}>{channel.metadata?.name} </div>
            <div className={styles.listChannelId}>{channel.sourceChannelId}</div>
            {channel.connected && (
              <div className={styles.connectedHint}>
                Connected <CheckMark />
              </div>
            )}
            <div className={styles.listButtons}>
              <Link className={styles.listButtonEdit} to={`${CHANNELS_TWILIO_SMS_ROUTE}/${channel.id}`}>
                Edit
              </Link>
              <LinkButton
                type="button"
                onClick={() => {
                  disconnectChannel(channel);
                }}>
                Delete
              </LinkButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.headline}>SMS</h1>
      <LinkButton onClick={props.history.goBack} type="button">
        <BackIcon className={styles.backIcon} />
        Back
      </LinkButton>

      {channelId === `${channelId}` && channelId !== 'overview' && showTwilioSmsForm()}
      {channelId === 'overview' && renderOverviewPage()}
    </div>
  );
};

export default connector(withRouter(TwilioSmsConnect));
