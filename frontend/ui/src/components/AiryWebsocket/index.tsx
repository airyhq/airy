import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {WebSocketClient} from 'websocketclient';
import {Message, Channel} from 'httpclient';

import {env} from '../../env';
import {StateModel} from '../../reducers';
import {addMessagesAction} from '../../actions/messages';
import {getConversationInfo, setConversationUnreadMessageCount} from '../../actions/conversations';
import {addChannelAction, removeChannelAction} from '../../actions/channel';

type AiryWebSocketProps = {} & ConnectedProps<typeof connector>;

export const AiryWebSocketContext = React.createContext({
  refreshSocket: null,
});

const mapStateToProps = (state: StateModel) => {
  return {
    conversations: state.data.conversations.all.items,
    user: state.data.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addMessagesAction: (conversationId: string, messages: Message[]) =>
      dispatch(addMessagesAction({conversationId, messages})),
    addChannelAction: (channel: Channel) => dispatch(addChannelAction(channel)),
    removeChannelAction: (channel: Channel) => dispatch(removeChannelAction(channel)),
    getConversationInfo: (conversationId: string) => dispatch(getConversationInfo(conversationId)),
    setConversationUnreadMessageCount: (conversationId: string, unreadMesageCount: number) =>
      dispatch(setConversationUnreadMessageCount(conversationId, unreadMesageCount)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const AiryWebSocket: React.FC<AiryWebSocketProps> = props => {
  const {
    children,
    conversations,
    getConversationInfo,
    user,
    addMessagesAction,
    addChannelAction,
    removeChannelAction,
    setConversationUnreadMessageCount,
  } = props;
  const [webSocketClient, setWebSocketClient] = useState(null);

  const addMessage = (conversationId: string, message: Message) => {
    if (conversations[conversationId]) {
      addMessagesAction(conversationId, [message]);
    } else {
      getConversationInfo(conversationId).then(() => {
        addMessagesAction(conversationId, [message]);
      });
    }
  };

  const refreshSocket = () => {
    if (webSocketClient) {
      webSocketClient.destroyConnection();
    }
    if (user.token) {
      setWebSocketClient(
        new WebSocketClient(
          user.token,
          {
            onMessage: (conversationId: string, _channelId: string, message: Message) => {
              addMessage(conversationId, message);
            },

            onUnreadCountUpdated: (conversationId: string, unreadMesageCount: number) => {
              setConversationUnreadMessageCount(conversationId, unreadMesageCount);
            },

            onChannelConnected: (channel: Channel) => {
              addChannelAction(channel);
            },

            onChannelDisconnected: (channel: Channel) => {
              removeChannelAction(channel);
            },
          },
          env.API_HOST
        )
      );
    }
  };

  useEffect(() => {
    refreshSocket();
  }, [user.token]);

  return <AiryWebSocketContext.Provider value={{refreshSocket}}>{children}</AiryWebSocketContext.Provider>;
};

export default connector(AiryWebSocket);
