import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {WebSocketClient} from 'websocketclient';
import {Message, Channel, MetadataEvent} from 'httpclient';
import camelcaseKeys from 'camelcase-keys';

import {env} from '../../env';
import {StateModel} from '../../reducers';
import {addMessagesAction} from '../../actions/messages';
import {getConversationInfo} from '../../actions/conversations';
import {setChannelAction} from '../../actions/channel';
import {setMetadataAction} from '../../actions/metadata';
import {allConversations} from '../../selectors/conversations';

type AiryWebSocketProps = {} & ConnectedProps<typeof connector>;

export const AiryWebSocketContext = React.createContext({
  refreshSocket: null,
});

const mapStateToProps = (state: StateModel) => {
  return {
    conversations: allConversations(state),
    user: state.data.user,
  };
};

const mapDispatchToProps = dispatch => ({
  addMessages: (conversationId: string, messages: Message[]) => dispatch(addMessagesAction({conversationId, messages})),
  onChannel: (channel: Channel) => dispatch(setChannelAction(channel)),
  getConversationInfo: (conversationId: string) => dispatch(getConversationInfo(conversationId)),
  onMetadata: (metadataEvent: MetadataEvent) => dispatch(setMetadataAction(camelcaseKeys(metadataEvent, {deep: true}))),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const AiryWebSocket: React.FC<AiryWebSocketProps> = props => {
  const {children, conversations, getConversationInfo, user, addMessages, onChannel, onMetadata} = props;
  const [webSocketClient, setWebSocketClient] = useState(null);

  const onMessage = (conversationId: string, message: Message) => {
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
        new WebSocketClient(env.API_HOST, user.token, {
          onMessage: (conversationId: string, _channelId: string, message: Message) => {
            onMessage(conversationId, message);
          },
          onChannel,
          onMetadata,
        })
      );
    }
  };

  useEffect(refreshSocket, [user.token]);

  return <AiryWebSocketContext.Provider value={{refreshSocket}}>{children}</AiryWebSocketContext.Provider>;
};

export default connector(AiryWebSocket);
