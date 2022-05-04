import {Button} from 'components/cta/Button';
import React, {useState} from 'react';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import styles from './index.module.scss';

type NewSubscriptionProps = {
  name?: string;
  url?: string;
  events?: string[];
  signatureKey?: string;
  headers?: {
    'X-Custom-Header': string;
  };
  messageCreated?: boolean;
  messageUpdated?: boolean;
  conversationUpdated?: boolean;
  channelUpdated?: boolean;
  newWebhook?: boolean;
  isLoading?: boolean;
  error?: boolean;
  setUpdateWebhook?: (
    update: boolean,
    url: string,
    name?: string,
    events?: string[],
    signatureKey?: string,
    headers?: {'X-Custom-Header': string}
  ) => void;
  setSubscribeWebhook?: (
    url: string,
    name?: string,
    events?: string[],
    signatureKey?: string,
    headers?: {'X-Custom-Header': string}
  ) => void;
};

const NewSubscription = (props: NewSubscriptionProps) => {
  const {
    name,
    url,
    events,
    headers,
    signatureKey,
    newWebhook,
    isLoading,
    error,
    setUpdateWebhook,
    setSubscribeWebhook,
  } = props;
  const [newUrl, setNewUrl] = useState(newWebhook ? '' : url);
  const [newName, setNewName] = useState(name || '');
  const [newEvents, setNewEvents] = useState(events || []);
  const [newHeaders, setNewHeaders] = useState(headers['X-Custom-Header'] || '');
  const [newSignatureKey, setNewSignatureKey] = useState(signatureKey || '');
  const [messageCreatedChecked, setMessageCreatedChecked] = useState(false);
  const [messageUpdatedChecked, setMessageUpdatedChecked] = useState(false);
  const [conversationUpdatedChecked, setConversationUpdatedChecked] = useState(false);
  const [channelUpdatedChecked, setChannelUpdatedChecked] = useState(false);

  const handleChecked = (event: string) => {
    switch (event) {
      case 'message.created': {
        setMessageCreatedChecked(!messageCreatedChecked);
        !newEvents.includes(event)
          ? setNewEvents([...newEvents, 'message.created'])
          : setNewEvents(newEvents.filter(item => item !== event));
        break;
      }
      case 'message.updated': {
        setMessageUpdatedChecked(!messageUpdatedChecked);
        !newEvents.includes(event)
          ? setNewEvents([...newEvents, 'message.updated'])
          : setNewEvents(newEvents.filter(item => item !== event));
        break;
      }
      case 'conversation.updated': {
        setConversationUpdatedChecked(!conversationUpdatedChecked);
        !newEvents.includes(event)
          ? setNewEvents([...newEvents, 'conversation.updated'])
          : setNewEvents(newEvents.filter(item => item !== event));
        break;
      }
      case 'channel.updated': {
        setChannelUpdatedChecked(!channelUpdatedChecked);
        !newEvents.includes(event)
          ? setNewEvents([...newEvents, 'channel.updated'])
          : setNewEvents(newEvents.filter(item => item !== event));
        break;
      }
    }
  };

  const updateWebhook = () => {
    setUpdateWebhook(true, newUrl, newName, newEvents, newSignatureKey, {'X-Custom-Header': newHeaders});
  };

  const subscribeToNewWebhook = () => {
    setSubscribeWebhook(newUrl, newName, newEvents, newSignatureKey, {'X-Custom-Header': newHeaders});
  };

  return (
    <form className={styles.formContainer}>
      <div className={styles.container}>
        <h1>WEBHOOK</h1>
        <div className={styles.inputContainer}>
          <input placeholder={name || 'Name'} value={newName} onChange={event => setNewName(event.target.value)} />
          <input
            placeholder={newWebhook ? 'URL' : url}
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            autoFocus={newWebhook ? true : false}
            required={true}
          />
        </div>
        <h1>ALL EVENTS</h1>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="message.created"
            name="message.created"
            checked={messageCreatedChecked}
            onChange={() => handleChecked('message.created')}
          />
          <label htmlFor="message.created">
            <span>Message.Created</span>
          </label>
          <input
            type="checkbox"
            id="message.updated"
            name="message.updated"
            checked={messageUpdatedChecked}
            onChange={() => handleChecked('message.updated')}
          />
          <label htmlFor="message.updated">
            <span>Message.Updated</span>
          </label>
          <input
            type="checkbox"
            id="conversation.updated"
            name="conversation.updated"
            checked={conversationUpdatedChecked}
            onChange={() => handleChecked('conversation.updated')}
          />
          <label htmlFor="conversation.updated">
            <span>Conversation.Updated</span>
          </label>
          <input
            type="checkbox"
            id="channel.updated"
            name="channel.updated"
            checked={channelUpdatedChecked}
            onChange={() => handleChecked('channel.updated')}
          />
          <label htmlFor="channel.updated">
            <span>Channel.Updated</span>
          </label>
        </div>
        <div className={styles.headerKeyContainer}>
          <div className={styles.headerKeyItem}>
            <span>(Customer Header)*</span>
            <input value={newHeaders} onChange={event => setNewHeaders(event.target.value)}></input>
          </div>
          <div className={styles.headerKeyItem}>
            <span>*Sign key</span>
            <input value={newSignatureKey} onChange={event => setNewSignatureKey(event.target.value)} />
          </div>
        </div>
      </div>
      <div className={isLoading ? styles.spinAnimation : ''} style={{display: 'flex', alignSelf: 'center'}}>
        <Button
          onClick={newWebhook ? subscribeToNewWebhook : updateWebhook}
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
            width: '213px',
            height: '48px',
            borderRadius: '10px',
          }}
          disabled={newUrl.length < 4 || isLoading}
          type="button"
        >
          {isLoading && <RefreshIcon height={24} width={24} />}
          {isLoading
            ? newWebhook
              ? 'Subscribing...'
              : 'Updating...'
            : error
            ? 'Try again...'
            : newWebhook
            ? 'Confirm'
            : 'Update'}
        </Button>
      </div>
      {error && <span className={styles.errorMessage}>Unable to {newWebhook ? 'subscribe' : 'update'} Webhook</span>}
    </form>
  );
};

export default NewSubscription;
