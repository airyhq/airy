import React from 'react';
import {useState, useEffect} from 'react';
import {IMessage} from '@stomp/stompjs';

import WebSocket from '../../websocket';
import MessageProp from '../../components/message';
import InputBarProp from '../../components/inputBar';
import AiryInputBar from '../../airyRenderProps/AiryInputBar';

import style from './index.module.scss';
import HeaderBarProp from '../../components/headerBar';
import AiryHeaderBar from '../../airyRenderProps/AiryHeaderBar';
import {AiryWidgetConfiguration} from '../../config';
import BubbleProp from '../bubble';
import AiryBubble from '../../airyRenderProps/AiryBubble';
import {MessagePayload, SenderType, MessageState, isFromContact, Message, messageMapper} from 'httpclient';
import {SourceMessage, CommandUnion} from 'render';
import {getResumeTokenFromStorage} from '../../storage';

let ws: WebSocket;

const welcomeMessage: Message = {
  id: '19527d24-9b47-4e18-9f79-fd1998b95059',
  content: {text: 'Hello! How can we help you?'},
  deliveryState: MessageState.delivered,
  senderType: SenderType.appUser,
  sentAt: new Date(),
};

type Props = AiryWidgetConfiguration;

const Chat = (props: Props) => {
  const [installError, setInstallError] = useState('');
  const [animation, setAnimation] = useState('');
  const [isChatHidden, setIsChatHidden] = useState(true);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);

  useEffect(() => {
    ws = new WebSocket(props.channelId, onReceive, setInitialMessages, getResumeTokenFromStorage(props.channelId));
    ws.start().catch(error => {
      console.error(error);
      setInstallError(error.message);
    });
  }, []);

  useEffect(() => {
    updateScroll();
  }, [messages]);

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
    ctrl.sendMessage(text);
  };

  const onReceive = (data: IMessage) => {
    const newMessage = messageMapper(JSON.parse(data.body).message as MessagePayload);
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

  const commandCallback = (command: CommandUnion) => {
    if (command.type === 'suggestedReply') {
      ws.onSend({type: 'suggestionResponse', text: command.payload.text, postbackData: command.payload.postbackData});
    }
  };

  return (
    <div className={style.main}>
      {!isChatHidden && (
        <div className={`${style.container} ${styleFor(animation)}`}>
          <HeaderBarProp render={headerBar} />
          <div className={style.chat}>
            <div id="messages" className={style.messages}>
              {messages.map((message, index: number) => {
                const nextMessage = messages[index + 1];
                const lastInGroup = nextMessage ? isFromContact(message) !== isFromContact(nextMessage) : true;

                return (
                  <MessageProp
                    key={message.id}
                    render={
                      props.airyMessageProp
                        ? () => props.airyMessageProp(ctrl)
                        : () => (
                            <SourceMessage
                              message={message}
                              source="chat_plugin"
                              lastInGroup={lastInGroup}
                              invertSides={true}
                              commandCallback={commandCallback}
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
