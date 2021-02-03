import React from 'react';
import {useState, useEffect} from 'react';
import {IMessage} from '@stomp/stompjs';

import WebSocket from '../../components/websocket';
import MessageProp from '../../components/message';
import InputBarProp from '../../components/inputBar';
import AiryInputBar from '../../airyRenderProps/AiryInputBar';

import style from './index.module.scss';
import HeaderBarProp from '../../components/headerBar';
import AiryHeaderBar from '../../airyRenderProps/AiryHeaderBar';
import {AiryWidgetConfiguration} from '../../config';
import BubbleProp from '../bubble';
import AiryBubble from '../../airyRenderProps/AiryBubble';
import AiryMessage from '../../airyRenderProps/AiryMessage';
import {MessagePayload, SenderType, MessageState} from 'httpclient';
import {SourceMessage} from 'render';

let ws: WebSocket;

const welcomeMessage: MessagePayload = {
  id: '19527d24-9b47-4e18-9f79-fd1998b95059',
  content: JSON.stringify({text: 'Hello! How can we help you?'}),
  delivery_state: MessageState.delivered,
  sender_type: SenderType.appUser,
  sent_at: new Date(),
};

type Props = AiryWidgetConfiguration;

const Chat = (props: Props) => {
  const [installError, setInstallError] = useState('');
  const [animation, setAnimation] = useState('');
  const [isChatHidden, setIsChatHidden] = useState(true);
  const [messages, setMessages] = useState<MessagePayload[]>([welcomeMessage]);

  useEffect(() => {
    ws = new WebSocket(props.channel_id, onReceive, setInitialMessages, getResumeToken());
    ws.start().catch(error => {
      console.error(error);
      setInstallError(error.message);
    });
  }, []);

  useEffect(() => {
    updateScroll();
  }, [messages]);

  const getResumeToken = () => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has('resume_token')) {
      localStorage.setItem('resume_token', queryParams.get('resume_token'));
    }
    return queryParams.get('resume_token') || localStorage.getItem('resume_token');
  };

  const setInitialMessages = (initalMessages: Array<MessagePayload>) => {
    setMessages([...messages, ...initalMessages]);
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
        text,
      });
    },
  };

  const sendMessage = (text: string) => {
    ctrl.sendMessage(text);
  };

  const onReceive = (data: IMessage) => {
    setMessages((messages: MessagePayload[]) => [...messages, JSON.parse(data.body).message]);
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

  const headerBar = props.headerBarProp
    ? () => props.headerBarProp(ctrl)
    : () => <AiryHeaderBar toggleHideChat={ctrl.toggleHideChat} />;

  const inputBar = props.inputBarProp
    ? () => props.inputBarProp(ctrl)
    : () => <AiryInputBar sendMessage={sendMessage} />;

  const bubble = props.bubbleProp
    ? () => props.bubbleProp(ctrl)
    : () => <AiryBubble isChatHidden={isChatHidden} toggleHideChat={ctrl.toggleHideChat} />;

  if (installError) {
    return null;
  }

  return (
    <div className={style.main}>
      {!isChatHidden && (
        <div className={`${style.container} ${styleFor(animation)}`}>
          <HeaderBarProp render={headerBar} />
          <div className={style.chat}>
            <div id="messages" className={style.messages}>
              {messages &&
                messages.map((message: MessagePayload) => {
                  return (
                    <MessageProp
                      key={message.id}
                      render={
                        props.airyMessageProp
                          ? () => props.airyMessageProp(ctrl)
                          : () => (
                              <SourceMessage
                                message={message as any}
                                conversation={
                                  {
                                    channel: {
                                      source: 'facebook',
                                    },
                                  } as any
                                }
                                prevWasContact
                                nextIsSameUser
                              />
                            )
                      }
                    />
                  );
                })}
            </div>
            <InputBarProp render={inputBar} />
          </div>
        </div>
      )}
      <BubbleProp render={bubble} />
    </div>
  );
};

export default Chat;
