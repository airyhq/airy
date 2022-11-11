import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {WebSocketClient} from 'websocketclient';
import {Message, Channel, MetadataEvent, Tag} from 'model';
import camelcaseKeys from 'camelcase-keys';

import {env} from '../../env';
import {StateModel} from '../../reducers';
import {addMessagesAction} from '../../actions/messages';
import {getConversationInfo} from '../../actions/conversations';
import {setChannelAction} from '../../actions/channel';
import {setMetadataAction} from '../../actions/metadata';
import {allConversations} from '../../selectors/conversations';
import {upsertTagAction} from '../../actions';

type AiryWebSocketProps = {children: React.ReactNode} & ConnectedProps<typeof connector>;

export const AiryWebSocketContext = React.createContext({refreshSocket: null});
let mapStateToProps;

if(window.location.pathname.includes("inbox")){
  mapStateToProps = (state: StateModel) => ({
    conversations: allConversations(state),
});
} else {
  mapStateToProps = null;
}

const mapDispatchToProps = dispatch => ({
  addMessages: (conversationId: string, messages: Message[]) => dispatch(addMessagesAction({conversationId, messages})),
  onChannel: (channel: Channel) => dispatch(setChannelAction(channel)),
  getConversationInfo: (conversationId: string) => dispatch(getConversationInfo(conversationId)),
  onMetadata: (metadataEvent: MetadataEvent) => {
    console.log('metadataEvent', metadataEvent);
    return dispatch(
      camelcaseKeys(setMetadataAction(metadataEvent), {
        deep: true,
        stopPaths: ['payload.metadata.user_data', 'payload.metadata.tags'],
      })
    )
  },
  onTag: (tag: Tag) => {
    dispatch(upsertTagAction(tag));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const AiryWebSocket: any = props => {
  const {children,  getConversationInfo, addMessages, onChannel, onMetadata, onTag} = props;
  const [webSocketClient, setWebSocketClient] = useState(null);

  const onMessage = (conversationId: string, message: Message) => {
    if (props?.conversations && props.conversations[conversationId]) {
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
    setWebSocketClient(
      new WebSocketClient(env.API_HOST, {
        onMessage: (conversationId: string, _channelId: string, message: Message) => {
          onMessage(conversationId, message);
        },
        onChannel,
        onMetadata,
        onTag,
      })
    );
  };

  useEffect(() => refreshSocket(), []);

  return <AiryWebSocketContext.Provider value={{refreshSocket}}>{children}</AiryWebSocketContext.Provider>;
};

export default connector(AiryWebSocket);
