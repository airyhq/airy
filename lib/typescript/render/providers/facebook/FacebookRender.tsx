import React from 'react';
import {isFromContact, Message} from "../../../httpclient/model";
import {getSharedComponentProps, MessageRenderProps} from "../../shared";
import {Text} from "../../components/Text";
import {ContentUnion} from "./facebookModel";

export const FacebookRender = (props: MessageRenderProps) => {
    const message = props.message;
    const content = isFromContact(message) ? facebookInbound(message) : facebookOutbound(message);
    return render(content, props);
}

function render(content: ContentUnion, props: MessageRenderProps) {
    switch (content.type) {
        case "text":
            return <Text
                {...getSharedComponentProps(props)}
                text={content.text}
            />

        // TODO render more facebook models
    }
}

// TODO map more string content to facebook models
function facebookInbound(message: Message): ContentUnion {
    const messageJson = JSON.parse(message.content)
    return {
        type: 'text',
        text: messageJson.message.text
    };
}

function facebookOutbound(message: Message): ContentUnion {
    const messageJson = JSON.parse(message.content)
    return {
        type: 'text',
        text: messageJson.text
    };
}
