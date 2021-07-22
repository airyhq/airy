import {OutboundMapper} from "./mapper";

export class TwilioMapper extends OutboundMapper {
    getTextPayload(text: string): any {
        return {
            Body: text,
        };
    }

    isTextSupported(): boolean {
        return true;
    }
}
