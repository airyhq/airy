import {h} from 'preact';
import {useState, useEffect} from 'preact/hooks';
import {IMessage} from '@stomp/stompjs';

import Websocket from '../../components/websocket';
import MessageProp from '../../components/message';
import InputBarProp from '../../components/inputBar';
import AiryInputBar from '../../airyRenderProps/AiryInputBar';

import style from './index.module.scss';
import HeaderBarProp from '../../components/headerBar';
import AiryHeaderBar from '../../airyRenderProps/AiryHeaderBar';
import AiryMessage from '../../airyRenderProps/AiryMessage';
import {AiryWidgetConfiguration} from '../../config';
import {RoutableProps} from 'preact-router';
import BubbleProp from '../bubble';
import AiryBubble from '../../airyRenderProps/AiryBubble';

let ws: Websocket;

const welcomeMessage = {
  sender_type: 'app_user',
  id: '19527d24-9b47-4e18-9f79-fd1998b95059',
  sent_at: 'undefined',
  content: {
    text: 'Hello! How can we help you?',
  },
};

type Props = AiryWidgetConfiguration & RoutableProps;

const Chat = (props: Props) => {
  const [installError, setInstallError] = useState('');
  const [animation, setAnimation] = useState('');
  const [isChatHidden, setIsChatHidden] = useState(true);
  const [messages, setMessages] = useState([welcomeMessage]);

  useEffect(() => {
    ws = new Websocket(props.channel_id, onReceive);
    ws.start().catch(error => {
      console.error(error);
      setInstallError(error.message);
    });
  }, []);

  useEffect(() => {
    updateScroll();
  }, [messages]);

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
      ws.onSend(
        JSON.stringify({
          message: {
            text,
          },
        })
      );
    },
  };

  const sendMessage = (text: string) => {
    ctrl.sendMessage(text);
  };

  const onReceive = (data: IMessage) => {
    setMessages(messages => [...messages, JSON.parse(data.body).message]);
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
              {messages.map(message => {
                return (
                  <MessageProp
                    render={
                      props.airyMessageProp
                        ? () => props.airyMessageProp(ctrl)
                        : () => <AiryMessage message={message} />
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
