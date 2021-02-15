import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {WebSocketClient} from 'websocketclient';
import {Message, Channel} from 'httpclient';

import {env} from '../../env';
import {StateModel} from '../../reducers';
import {addMessagesAction} from '../../actions/messages';
import {getConversationInfo} from '../../actions/conversations';
import {addChannelAction, removeChannelAction} from '../../actions/channel';
import {setMetadataAction} from '../../actions/metadata';

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
    addMessages: (conversationId: string, messages: Message[]) =>
      dispatch(addMessagesAction({conversationId, messages})),
    addChannel: (channel: Channel) => dispatch(addChannelAction(channel)),
    removeChannel: (channel: Channel) => dispatch(removeChannelAction(channel)),
    getConversationInfo: (conversationId: string) => dispatch(getConversationInfo(conversationId)),
    setConversationUnreadCount: (conversationId: string, unreadCount: number) =>
      dispatch(
        setMetadataAction({
          subject: 'conversation',
          identifier: conversationId,
          metadata: {
            unreadCount,
          },
        })
      ),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const AiryWebSocket: React.FC<AiryWebSocketProps> = props => {
  const {
    children,
    conversations,
    getConversationInfo,
    user,
    addMessages,
    addChannel,
    removeChannel,
    setConversationUnreadCount,
  } = props;
  const [webSocketClient, setWebSocketClient] = useState(null);

  const addMessage = (conversationId: string, message: Message) => {
    if (conversations[conversationId]) {
      addMessages(conversationId, [message]);
    } else {
      getConversationInfo(conversationId).then(() => {
        addMessages(conversationId, [message]);
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
            onUnreadCountUpdated: setConversationUnreadCount,
            onChannelConnected: addChannel,
            onChannelDisconnected: removeChannel,
          },
          env.API_HOST
        )
      );
    }
  };

  useEffect(refreshSocket, [user.token]);

  return <AiryWebSocketContext.Provider value={{refreshSocket}}>{children}</AiryWebSocketContext.Provider>;
};

export default connector(AiryWebSocket);
