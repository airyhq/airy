import React from 'react';
import {isFromContact} from "../../../httpclient/model";
import {getSharedComponentProps, MessageRenderProps} from "../../shared";
import {Text} from "../../components/Text";

export const FacebookRender = (props: MessageRenderProps) => {
    if (isFromContact(props.message)) {
        return facebookInbound(props);
    }

    return facebookOutbound(props);
}

function facebookInbound(props: MessageRenderProps) {
    const messageJson = JSON.parse(props.message.content)

    return <Text
        {...getSharedComponentProps(props)}
        text={messageJson.text}
    />
}

function facebookOutbound(props: MessageRenderProps) {
    const messageJson = JSON.parse(props.message.content)

    return <Text
        {...getSharedComponentProps(props)}
        text={messageJson.message.text}
    />
}
