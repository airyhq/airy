import React, {useEffect, useState} from 'react';
import {ReactComponent as PensilIcon} from 'assets/images/icons/pencil.svg';
import styles from './index.module.scss';
import {Switch} from '../../../components/Switch';
import {connect, ConnectedProps} from 'react-redux';
import {subscribeWebhook, unsubscribeWebhook, updateWebhook} from '../../../actions/webhook';

type WebhooksListItemProps = {
  id: string;
  name?: string;
  url: string;
  events?: [string];
  headers?: {
    'X-Custom-Header': string;
  };
  status?: string;
  signatureKey?: string;
  switchId?: string;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  subscribeWebhook,
  unsubscribeWebhook,
  updateWebhook,
};

const connector = connect(null, mapDispatchToProps);

const WebhooksListItem = (props: WebhooksListItemProps) => {
  const {
    id,
    name,
    url,
    events,
    headers,
    status,
    signatureKey,
    switchId,
    subscribeWebhook,
    unsubscribeWebhook,
    updateWebhook,
  } = props;
  const [subscribed, setSubscribed] = useState(status);
  const [newUrl, setNewUrl] = useState(url);
  const [newName, setNewName] = useState(name);
  const [newEvents, setNewEvents] = useState([events]);
  const [newSignatureKey, setNewSignatureKey] = useState(signatureKey);
  const [editModeOn, setEditModeOn] = useState(false);

  const handleToggle = () => {
    status === 'Subscribed'
      ? (unsubscribeWebhook({url}), setSubscribed('Unsubscribed'))
      : (subscribeWebhook({url}), setSubscribed('Subscribed'));
  };

  console.log('name', name);
  console.log('url', url);
  console.log('events', events);

  const eventss = ['Message.Created', 'Message.Updated', 'Conversation.Updated', 'Channel.Updated'];

  const handleOnChange = (event, name) => {
    name === 'url' && setNewUrl(event.target.value);
    name === 'name' && setNewName(event.target.value);
    name === 'events' && setNewEvents(event.target.value);
  };

  console.log('NEWURL: ', newUrl);
  console.log('NEWNAME: ', newName);

  return (
    <div className={styles.container}>
      {editModeOn ? (
        <>
          <input className={styles.inputs} placeholder={url} onChange={event => handleOnChange(event, 'url')}></input>
          <input className={styles.inputs} placeholder={name} onChange={event => handleOnChange(event, 'name')}></input>
          <div className={styles.eventsContainer} style={{width: '25%'}}>
            {eventss &&
              eventss.map((event, index) => (
                <input
                  className={styles.inputs}
                  placeholder={event}
                  onChange={event => handleOnChange(event, 'events')} style={{width: '100%'}}></input>
              ))}
          </div>
        </>
      ) : (
        <>
          <span>{url}</span>
          <p>21u8932gggggggg</p>
          <div className={styles.eventsContainer}>
            <>{eventss && eventss.map((event, index) => <p key={index}>{event}</p>)}</>
          </div>
        </>
      )}

      <div className={styles.statusContainer} style={{width: '10%'}}>
        <Switch
          id={switchId}
          isActive={subscribed === 'Subscribed' ? true : false}
          toggleActive={handleToggle}
          onColor="#EFEFEF"
        />
        <div
          className={styles.pensilIcon}
          onClick={() => {
            setEditModeOn(!editModeOn);
          }}>
          <PensilIcon height={12} width={12} />
        </div>
      </div>
    </div>
  );
};

export default connector(WebhooksListItem);
