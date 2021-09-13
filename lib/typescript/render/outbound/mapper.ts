export abstract class OutboundMapper {
  abstract isTextSupported(): boolean;
  abstract getTextPayload(text: string): any;
}
