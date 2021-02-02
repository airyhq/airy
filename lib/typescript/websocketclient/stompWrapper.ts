import {Client, IFrame, IMessage, StompSubscription} from '@stomp/stompjs';

type QueueMappingType = {[destination: string]: (message: IMessage) => void};
type ErrorCallback = () => void;

export class StompWrapper {
  stompClient: Client;
  authToken: string;
  onError: ErrorCallback;
  url: string;

  queues: StompSubscription[];
  queueMapping: QueueMappingType;

  constructor(url: string, queueMapping: QueueMappingType, authToken: string, onError: ErrorCallback) {
    this.url = url;
    this.queueMapping = queueMapping;
    this.authToken = authToken;
    this.onError = onError;
  }

  initConnection = () => {
    this.stompClient = new Client({
      connectHeaders: {
        Authorization: `Bearer ${this.authToken}`,
      },
      brokerURL: this.url,
      reconnectDelay: 2000,
      onConnect: this.stompOnConnect,
      onStompError: this.stompOnError,
    });
    this.stompClient.activate();
  };

  destroyConnection = () => {
    this.stompClient.deactivate();
    if (this.queues) {
      this.queues.filter(it => !!it).forEach(queue => queue.unsubscribe());
    }
  };

  stompOnConnect = () => {
    this.queues = Object.keys(this.queueMapping).reduce(
      (acc, queue) => acc.concat([this.stompClient.subscribe(queue, this.queueMapping[queue])]),
      []
    );
  };

  stompOnError = (error: IFrame) => {
    if (error.headers.message.includes('401')) {
      this.onError();
    }
  };

  publish = (queue, body) => {
    if (!this.stompClient || !this.stompClient.connected) {
      return false;
    }
    this.stompClient.publish({
      destination: queue,
      body: JSON.stringify(body),
    });
  };

  refreshSocket = userToken => {
    this.destroyConnection();
    this.authToken = userToken;
    this.initConnection();
  };
}
