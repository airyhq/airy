import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {WebSocketClient} from 'websocketclient';
import {updateComponentInstallationStatusAction} from '../../actions';

import {env} from '../../env';

type AiryWebSocketProps = {children: React.ReactNode} & ConnectedProps<typeof connector>;

export const AiryWebSocketContext = React.createContext({refreshSocket: null});

const mapDispatchToProps = () => dispatch => ({
  onComponentUpdate: update => dispatch(updateComponentInstallationStatusAction(update)),
});

const connector = connect(null, mapDispatchToProps);

const AiryWebSocket: React.FC<AiryWebSocketProps> = props => {
  const {children, onComponentUpdate} = props;
  const [webSocketClient, setWebSocketClient] = useState(null);

  const refreshSocket = () => {
    if (webSocketClient) {
      webSocketClient.destroyConnection();
    }
    setWebSocketClient(
      new WebSocketClient(env.API_HOST, {
        onComponentUpdate,
      })
    );
  };

  useEffect(() => refreshSocket(), []);

  return <AiryWebSocketContext.Provider value={{refreshSocket}}>{children}</AiryWebSocketContext.Provider>;
};

export default connector(AiryWebSocket);
