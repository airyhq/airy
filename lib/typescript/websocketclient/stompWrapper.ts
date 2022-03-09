import {Client, IFrame, IMessage, StompSubscription} from '@stomp/stompjs';

type QueueMappingType = {[destination: string]: (message: IMessage) => void};
type ErrorCallback = () => void;

export class StompWrapper {
  stompClient: Client;
  onError: ErrorCallback;
  url: string;
  private readonly authToken: string;

  queues: StompSubscription[];
  queueMapping: QueueMappingType;

  constructor(url: string, queueMapping: QueueMappingType, onError: ErrorCallback, authToken?: string) {
    this.url = url;
    this.queueMapping = queueMapping;
    this.onError = onError;
    this.authToken = authToken;
  }

  initConnection = () => {
    console.debug('authToken', {
      ...(this.authToken && {Authorization: `Bearer ${this.authToken}`}),
    });
    this.stompClient = new Client({
      brokerURL: this.url,
      reconnectDelay: 2000,
      onConnect: this.stompOnConnect,
      onStompError: this.stompOnError,
      connectHeaders: {
        ...(this.authToken && {Authorization: `Bearer ${this.authToken}`}),
      },
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
    console.debug('error', error);
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

  refreshSocket = () => {
    this.destroyConnection();
    this.initConnection();
  };
}
