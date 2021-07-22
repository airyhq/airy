import {OutboundMapper} from "./mapper";

export class GoogleMapper extends OutboundMapper {
    getTextPayload(text: string): any {
        return {
            text,
            representative: {
                representativeType: 'HUMAN',
            },
        }
    }

    isTextSupported(): boolean {
        return true;
    }
}
