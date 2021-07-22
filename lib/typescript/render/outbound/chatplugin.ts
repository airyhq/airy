import {OutboundMapper} from "./mapper";

export class ChatpluginMapper extends OutboundMapper {
    getTextPayload(text: string): any {
        return {
            text,
        };
    }

    isTextSupported(): boolean {
        return true;
    }
}
