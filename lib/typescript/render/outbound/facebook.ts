import {OutboundMapper} from "./mapper";

export class FacebookMapper extends OutboundMapper {
    getTextPayload(text: string): any {
        return {
            text,
        };
    }

    isTextSupported(): boolean {
        return true;
    }
}
