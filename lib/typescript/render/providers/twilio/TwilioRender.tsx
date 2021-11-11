import React from 'react';
import {Text, Image, File, Video, Audio} from '../../components';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './twilioModel';
import {decodeURIComponentMessage, getAttachmentType} from '../../services';

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
      return (
        <Image
          imageUrl={content.imageUrl}
          altText="an image sent via a Twilio source"
          text={content?.text}
          fromContact={props.message.fromContact || false}
        />
      );

    case 'video':
      return (
        <Video videoUrl={content.videoUrl} text={content?.text} fromContact={props.message.fromContact || false} />
      );

    case 'audio':
      return <Audio audioUrl={content.audioUrl} />;

    case 'file':
      return <File fileUrl={content.fileUrl} />;
  }
}

const inboundContent = (message): ContentUnion => {
  const messageContent = message.content;
  let text;

  console.log('inbound', messageContent);

  //image (with optional text caption)
  if (messageContent.includes('MediaContentType0=image')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const imageUrl = decodeURIComponentMessage(messageContent, contentStart, contentEnd);

    if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      const contentStart = '&Body=';
      const contentEnd = '&To=whatsapp';
      text = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    }

    return {
      type: 'image',
      imageUrl: imageUrl,
      text: text ?? null,
    };
  }

  //video (with optional text caption)
  if (messageContent.includes('MediaContentType0=video')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const videoUrl = decodeURIComponentMessage(messageContent, contentStart, contentEnd);

    if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      const contentStart = '&Body=';
      const contentEnd = '&To=whatsapp';
      text = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    }

    return {
      type: 'video',
      videoUrl: videoUrl,
      text: text ?? null,
    };
  }

  //audio
  if (messageContent.includes('MediaContentType0=audio')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const audioUrl = decodeURIComponentMessage(messageContent, contentStart, contentEnd);

    return {
      type: 'audio',
      audioUrl: audioUrl,
    };
  }

  //file
  if (messageContent.includes('MediaContentType0=application%2Fpdf')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const fileUrl = decodeURIComponentMessage(messageContent, contentStart, contentEnd) + '.pdf';

    //console.log('fileUrl', fileUrl);

    return {
      type: 'file',
      fileUrl: fileUrl,
    };
  }

  //text (nb: files that are not supported are sent as a text with the filename)
  if (messageContent.includes('&Body=' && '&FromCountry=')) {
    const contentStart = '&Body=';
    const contentEnd = '&FromCountry=';
    text = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
  } else if (messageContent.includes('&Body=' && '&To=whatsapp')) {
    const contentStart = '&Body=';
    const contentEnd = '&To=whatsapp';
    text = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
  }

  return {
    type: 'text',
    text: text ?? 'Unsupported message type',
  };
};

const outboundContent = (message): ContentUnion => {
  const messageContent = message?.content?.message ?? message?.content ?? message;

  //media
  if (messageContent?.MediaUrl) {
    const mediaUrl = messageContent.MediaUrl;
    const mediaAttachmenttype = getAttachmentType(mediaUrl, 'twilio.whatsapp');

    if (mediaAttachmenttype === 'image') {
      return {
        type: 'image',
        imageUrl: mediaUrl,
      };
    }

    if (mediaAttachmenttype === 'video') {
      return {
        type: 'video',
        videoUrl: mediaUrl,
      };
    }

    if (mediaAttachmenttype === 'file') {
      return {
        type: 'file',
        fileUrl: mediaUrl,
      };
    }

    if (mediaAttachmenttype === 'audio') {
      return {
        type: 'audio',
        audioUrl: mediaUrl,
      };
    }

    return {
      type: 'text',
      text: 'Unsupported message type',
    };
  }

  //text
  return {
    type: 'text',
    text: messageContent?.Body,
  };
};
