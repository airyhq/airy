import {Button} from 'components/cta/Button';
import React, {useLayoutEffect, useState} from 'react';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import styles from './index.module.scss';
import {Webhook, WebhooksEventType} from 'model/Webhook';
import {useTranslation} from 'react-i18next';

type SubscriptionModalProps = {
  webhook: Webhook;
  messageCreated?: boolean;
  messageUpdated?: boolean;
  conversationUpdated?: boolean;
  channelUpdated?: boolean;
  newWebhook?: boolean;
  isLoading?: boolean;
  error?: boolean;
  setUpsertWebhook?: (isNew: boolean, webhook: Webhook) => void;
};

const isEventOn = (events: WebhooksEventType[] | undefined, event: WebhooksEventType): boolean => {
  return events?.includes(event);
};

const SubscriptionModal = (props: SubscriptionModalProps) => {
  const {webhook, newWebhook, isLoading, error, setUpsertWebhook} = props;
  const {name, url, events, headers, signatureKey} = webhook;
  const [buttonTitle, setButtonTitle] = useState('');
  const [newUrl, setNewUrl] = useState(newWebhook ? '' : url);
  const [newName, setNewName] = useState(name || '');
  const [newEvents, setNewEvents] = useState(events || []);
  const [newHeaders, setNewHeaders] = useState(headers['X-Custom-Header'] || '');
  const [newSignatureKey, setNewSignatureKey] = useState(signatureKey || '');
  const [messageCreatedChecked, setMessageCreatedChecked] = useState(
    isEventOn(events, WebhooksEventType.messageCreated)
  );
  const [messageUpdatedChecked, setMessageUpdatedChecked] = useState(
    isEventOn(events, WebhooksEventType.messageUpdated)
  );
  const [conversationUpdatedChecked, setConversationUpdatedChecked] = useState(
    isEventOn(events, WebhooksEventType.conversationUpdated)
  );
  const [channelUpdatedChecked, setChannelUpdatedChecked] = useState(
    isEventOn(events, WebhooksEventType.channelUpdated)
  );
  const {t} = useTranslation();

  const handleChecked = (event: WebhooksEventType) => {
    switch (event) {
      case WebhooksEventType.messageCreated: {
        setMessageCreatedChecked(!messageCreatedChecked);
        !newEvents.includes(event)
          ? setNewEvents([...newEvents, WebhooksEventType.messageCreated])
          : setNewEvents(newEvents.filter(item => item !== event));
        break;
      }
      case WebhooksEventType.messageUpdated: {
        setMessageUpdatedChecked(!messageUpdatedChecked);
        !newEvents.includes(event)
          ? setNewEvents([...newEvents, WebhooksEventType.messageUpdated])
          : setNewEvents(newEvents.filter(item => item !== event));
        break;
      }
      case WebhooksEventType.conversationUpdated: {
        setConversationUpdatedChecked(!conversationUpdatedChecked);
        !newEvents.includes(event)
          ? setNewEvents([...newEvents, WebhooksEventType.conversationUpdated])
          : setNewEvents(newEvents.filter(item => item !== event));
        break;
      }
      case WebhooksEventType.channelUpdated: {
        setChannelUpdatedChecked(!channelUpdatedChecked);
        !newEvents.includes(event)
          ? setNewEvents([...newEvents, WebhooksEventType.channelUpdated])
          : setNewEvents(newEvents.filter(item => item !== event));
        break;
      }
    }
  };

  useLayoutEffect(() => {
    getButtonTitle();
  }, [isLoading, error]);

  const getButtonTitle = () => {
    if (error) {
      return setButtonTitle(t('tryAgain'));
    }
    if (!isLoading) {
      if (newWebhook) {
        return setButtonTitle(t('subscribeCapital'));
      } else {
        return setButtonTitle(t('updateCapital'));
      }
    } else {
      if (newWebhook) {
        return setButtonTitle(t('subscribing'));
      } else {
        return setButtonTitle(t('updating'));
      }
    }
  };

  const upsertWebhook = (isNew: boolean) => {
    setUpsertWebhook(isNew, {
      ...webhook,
      ...(newUrl && {
        url: newUrl,
      }),
      ...(newName && {
        name: newName,
      }),
      ...(newEvents && {
        events: newEvents,
      }),
      ...(newSignatureKey && {
        signatureKey: newSignatureKey,
      }),
      ...(newSignatureKey && {
        signatureKey: newSignatureKey,
      }),
      ...(newHeaders && {
        headers: {'X-Custom-Header': newHeaders},
      }),
    });
  };

  return (
    <form className={styles.formContainer}>
      <div className={styles.container}>
        <h1>{t('webhookCapslock')}</h1>
        <div className={styles.inputContainer}>
          <input placeholder={name || t('name')} value={newName} onChange={event => setNewName(event.target.value)} />
          <input
            placeholder={newWebhook ? 'URL' : url}
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            autoFocus={newWebhook ? true : false}
            required={true}
          />
        </div>
        <h1>{t('allEvents')}</h1>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="message.created"
            name="message.created"
            checked={messageCreatedChecked}
            onChange={() => handleChecked(WebhooksEventType.messageCreated)}
          />
          <label htmlFor="message.created">
            <span>Message.Created</span>
          </label>
          <input
            type="checkbox"
            id="message.updated"
            name="message.updated"
            checked={messageUpdatedChecked}
            onChange={() => handleChecked(WebhooksEventType.messageUpdated)}
          />
          <label htmlFor="message.updated">
            <span>Message.Updated</span>
          </label>
          <input
            type="checkbox"
            id="conversation.updated"
            name="conversation.updated"
            checked={conversationUpdatedChecked}
            onChange={() => handleChecked(WebhooksEventType.conversationUpdated)}
          />
          <label htmlFor="conversation.updated">
            <span>Conversation.Updated</span>
          </label>
          <input
            type="checkbox"
            id="channel.updated"
            name="channel.updated"
            checked={channelUpdatedChecked}
            onChange={() => handleChecked(WebhooksEventType.channelUpdated)}
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
          onClick={() => upsertWebhook(newWebhook)}
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
          <>
            {isLoading && <RefreshIcon height={24} width={24} />}
            {buttonTitle}
          </>
        </Button>
      </div>
      {error && (
        <span className={styles.errorMessage}>Unable to {newWebhook ? t('subscribe') : t('update')} Webhook</span>
      )}
    </form>
  );
};

export default SubscriptionModal;
