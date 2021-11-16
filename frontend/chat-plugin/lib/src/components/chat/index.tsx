import React from 'react';
import {useState, useEffect} from 'react';
import {IMessage} from '@stomp/stompjs';
import {useTranslation} from 'react-i18next';

import {DeliveryState, Message} from 'model';

import WebSocket, {ConnectionState} from '../../websocket';
import MessageProp from '../../components/message';
import InputBarProp from '../../components/inputBar';
import AiryInputBar from '../../airyRenderProps/AiryInputBar';

import HeaderBarProp from '../../components/headerBar';
import AiryHeaderBar from '../../airyRenderProps/AiryHeaderBar';

import {AiryChatPluginConfiguration} from '../../config';

import BubbleProp from '../bubble';
import AiryBubble from '../../airyRenderProps/AiryBubble';

import {SourceMessage, CommandUnion} from 'render';
import {MessageInfoWrapper} from 'components';

/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {cyBubble, cyChatPluginMessageList, cyChatPluginEndChatModalButton} from 'chat-plugin-handles';
import {getResumeTokenFromStorage, resetStorage} from '../../storage';
import NewConversation from '../../components/newConversation';
import {setApiHost, authenticate} from '../../api';

import style from './index.module.scss';

let ws: WebSocket;

const defaultWelcomeMessage: Message = {
  id: '19527d24-9b47-4e18-9f79-fd1998b95059',
  content: {text: 'Hello! How can we help you?'},
  deliveryState: DeliveryState.delivered,
  fromContact: false,
  sentAt: new Date(),
};

type Props = AiryChatPluginConfiguration;

const Chat = ({config, ...props}: Props) => {
  config = config || {};
  const {t} = useTranslation();

  if (config.welcomeMessage) {
    defaultWelcomeMessage.content = config.welcomeMessage;
  }

  const chatHiddenInitialState = (): boolean => {
    if (config.showMode === true) return false;
    if (config.bubbleState === 'expanded') {
      return false;
    }
    if (config.bubbleState === 'minimized') {
      return true;
    }
    return !!getResumeTokenFromStorage(props.channelId);
  };

  const [installError, setInstallError] = useState('');
  const [animation, setAnimation] = useState('');
  const [isChatHidden, setIsChatHidden] = useState(chatHiddenInitialState());
  const [messages, setMessages] = useState<Message[]>([defaultWelcomeMessage]);
  const [messageString, setMessageString] = useState('');
  const [connectionState, setConnectionState] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newConversation, setNewConversation] = useState(false);

  useEffect(() => {
    if (config.showMode) return;
    setApiHost(props.apiHost);

    ws = new WebSocket(props.apiHost, props.channelId, onReceive, setInitialMessages, (state: ConnectionState) => {
      setConnectionState(state);
    });
    ws.start().catch(error => {
      console.error(error);
      setInstallError(error.message);
    });
  }, [props.apiHost, props.channelId]);

  useEffect(() => {
    setAnimation('');
  }, [config]);

  useEffect(() => {
    updateScroll();
  }, [messages]);

  useEffect(() => {
    setNewConversation(true);
  }, []);

  const setInitialMessages = (initialMessages: Array<Message>) => {
    setMessages([...messages, ...initialMessages]);
  };

  const ctrl = {
    toggleHideChat: () => {
      const newValue = !isChatHidden;
      if (newValue) {
        setAnimation('close');
        setTimeout(() => {
          setIsChatHidden(newValue);
        }, 500);
      } else {
        setAnimation('open');
        setIsChatHidden(newValue);
        setTimeout(() => {
          updateScroll();
        }, 100);
      }
    },
    sendMessage: (text: string) => {
      ws.onSend({
        type: 'text',
        text,
      });
    },
  };

  const sendMessage = (text: string) => {
    if (config.showMode) return;
    ctrl.sendMessage(text);
  };

  const onReceive = (data: IMessage) => {
    const messagePayload = (JSON.parse(data.body) as any).message;
    const newMessage = {
      ...camelcaseKeys(messagePayload, {deep: true, stopPaths: ['content']}),
      sentAt: new Date(messagePayload.sent_at),
    };
    setMessages((messages: Message[]) => [...messages, newMessage]);
  };

  const updateScroll = () => {
    const element = document.getElementById('messages');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  const styleFor = (animation: string) => {
    switch (animation) {
      case 'open':
        return style.containerAnimationOpen;
      case 'close':
        return style.containerAnimationClose;
      default:
        return '';
    }
  };

  const closeModalOnClick = () => setShowModal(false);

  const cancelChatSession = () => {
    setNewConversation(false);
    resetStorage(props.channelId);
    closeModalOnClick();
    ctrl.toggleHideChat();
  };

  const reAuthenticate = () => {
    authenticate(props.channelId, getResumeTokenFromStorage(props.channelId));
  };

  const headerBar = props.headerBarProp
    ? () => props.headerBarProp(ctrl)
    : () => <AiryHeaderBar toggleHideChat={ctrl.toggleHideChat} config={config} setShowModal={setShowModal} />;

  const inputBar = props.inputBarProp
    ? () => props.inputBarProp(ctrl)
    : () =>
        newConversation ? (
          <AiryInputBar
            sendMessage={sendMessage}
            messageString={messageString}
            setMessageString={setMessageString}
            config={config}
            setNewConversation={setNewConversation}
          />
        ) : (
          <NewConversation
            reAuthenticate={reAuthenticate}
            startNewConversationText={config.startNewConversationText || null}
          />
        );

  const bubble = props.bubbleProp
    ? () => props.bubbleProp(ctrl)
    : () => (
        <AiryBubble
          isChatHidden={isChatHidden}
          toggleHideChat={ctrl.toggleHideChat}
          dataCyId={cyBubble}
          config={config}
        />
      );

  if (installError) {
    return null;
  }

  const commandCallback = (command: CommandUnion) => {
    if (command.type === 'suggestedReply') {
      ws.onSend({
        type: 'suggestionResponse',
        text: command.payload.text,
        postbackData: command.payload.postbackData,
      });
    }
    if (command.type === 'quickReplies') {
      ws.onSend({type: 'quickReplies', text: command.payload.text, postbackData: command.payload.postbackData});
    }
  };

  return (
    <div className={`${config.disableMobile === true ? style.mainFlex : style.main}`}>
      {!isChatHidden && (
        <div
          className={`${style.wrapper} ${styleFor(animation)}`}
          style={config.backgroundColor && {backgroundColor: config.backgroundColor}}
        >
          <HeaderBarProp render={headerBar} />
          <div className={style.connectedContainer}>
            <div className={style.chat}>
              <div id="messages" className={style.messages} data-cy={cyChatPluginMessageList}>
                {messages.map((message: Message, index: number) => {
                  const nextMessage = messages[index + 1];
                  const lastInGroup = nextMessage ? message.fromContact !== nextMessage.fromContact : true;

                  return (
                    <MessageProp
                      key={message.id}
                      render={
                        props.airyMessageProp
                          ? () => props.airyMessageProp(ctrl)
                          : () => (
                              <MessageInfoWrapper
                                fromContact={message.fromContact}
                                isChatPlugin={true}
                                lastInGroup={lastInGroup}
                              >
                                <SourceMessage
                                  contentType="message"
                                  message={message}
                                  source="chatplugin"
                                  invertSides={true}
                                  commandCallback={commandCallback}
                                />
                              </MessageInfoWrapper>
                            )
                      }
                    />
                  );
                })}
              </div>
              <InputBarProp render={inputBar} />
              {connectionState === ConnectionState.Disconnected && (
                <div className={style.modalOverlay}>Reconnecting...</div>
              )}
              {showModal && (
                <div className={style.modalOverlay}>
                  <div className={style.modalCloseChat}>
                    <p>Are you sure you want to end this chat?</p>
                    <div className={style.buttonWrapper}>
                      <button className={style.cancelButton} onClick={closeModalOnClick}>
                        {' '}
                        {t('cancel')}
                      </button>
                      <button
                        className={style.endChatButton}
                        onClick={cancelChatSession}
                        data-cy={cyChatPluginEndChatModalButton}
                      >
                        {' '}
                        {t('endChat')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <BubbleProp render={bubble} />
    </div>
  );
};

export default Chat;
