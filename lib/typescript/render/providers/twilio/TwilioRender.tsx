import React from 'react';
import {Text, Image, File, Video, Audio} from '../../components';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './twilioModel';
import {decodeTwilioSourceMessage} from '../../services';

export const TwilioRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact ? inboundContent(message) : outboundContent(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.message.fromContact || false} text={content.text} />;

    case 'image':
      return <Image imageUrl={content.imageUrl} altText="an image sent via a Twilio source" />;

    case 'video':
      return <Video videoUrl={content.videoUrl} />;

    case 'audio':
      return <Audio audioUrl={content.audioUrl} />;

    case 'file':
      return <File fileUrl={content.fileUrl} fileName="PDF file" />;
  }
}

const inboundContent = (message): ContentUnion => {
  const messageContent = message.content;
  console.log('messageContent - inbound', messageContent);
  let text = 'Unsupported message type';

  //image
  if (messageContent.includes('MediaContentType0=image')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const imageUrl = decodeTwilioSourceMessage(messageContent, contentStart, contentEnd);

    return {
      type: 'image',
      imageUrl: imageUrl,
    };
  }

  //video
  if (messageContent.includes('MediaContentType0=video')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const videoUrl = decodeTwilioSourceMessage(messageContent, contentStart, contentEnd);

    return {
      type: 'video',
      videoUrl: videoUrl,
    };
  }

  //audio
  if (messageContent.includes('MediaContentType0=audio')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const audioUrl = decodeTwilioSourceMessage(messageContent, contentStart, contentEnd);

    return {
      type: 'audio',
      audioUrl: audioUrl,
    };
  }

  //file: pdf
  if (messageContent.includes('MediaContentType0=application%2Fpdf')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const fileUrl = decodeTwilioSourceMessage(messageContent, contentStart, contentEnd) + '.pdf';

    return {
      type: 'file',
      fileUrl: fileUrl,
    };
  }

  //text
  if (messageContent.includes('&Body=' && '&FromCountry=')) {
    const contentStart = '&Body=';
    const contentEnd = '&FromCountry=';
    text = decodeTwilioSourceMessage(messageContent, contentStart, contentEnd);
  } else if (messageContent.includes('&Body=' && '&To=whatsapp')) {
    const contentStart = '&Body=';
    const contentEnd = '&To=whatsapp';
    text = decodeTwilioSourceMessage(messageContent, contentStart, contentEnd);
  }

  return {
    type: 'text',
    text: text,
  };
};

const outboundContent = (message): ContentUnion => {
  const messageContent = message.content.message ?? message.content;
  console.log('messageContent - outbound', messageContent);

  return {
    type: 'text',
    text: messageContent.Body,
  };
};
