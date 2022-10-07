import React from 'react';
import {Text, Image, File, Video} from '../../components';
import {AudioClip} from 'components';
import {CurrentLocation} from '../../components/CurrentLocation';
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
      return <Video videoUrl={content.videoUrl} />;

    case 'audio':
      return <AudioClip audioUrl={content.audioUrl} />;

    case 'file':
      return <File fileUrl={content.fileUrl} fileType={content.fileType} />;

    case 'currentLocation':
      return (
        <CurrentLocation
          latitude={content.latitude}
          longitude={content.longitude}
          fromContact={props.message.fromContact || false}
        />
      );
  }
}

const inboundContent = (message): ContentUnion => {
  const messageContent = message.content;

  if (messageContent.includes('MediaContentType0=image')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const imageUrl = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    let textCaption;

    if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      const contentStart = '&Body=';
      const contentEnd = '&To=whatsapp';
      textCaption = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    }

    return {
      type: 'image',
      imageUrl: imageUrl,
      text: textCaption ?? null,
    };
  }

  //video (with optional text caption)
  if (messageContent.includes('MediaContentType0=video')) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const videoUrl = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    let textCaption;

    if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      const contentStart = '&Body=';
      const contentEnd = '&To=whatsapp';
      textCaption = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    }

    return {
      type: 'video',
      videoUrl: videoUrl,
      text: textCaption ?? null,
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

  //file: pdf or vcf
  if (
    messageContent.includes('MediaContentType0=application%2Fpdf') ||
    messageContent.includes('MediaContentType0=text%2Fvcard')
  ) {
    const contentStart = 'MediaUrl0=';
    const contentEnd = '&ApiVersion=';
    const fileUrl = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    let type;

    if (messageContent.includes('MediaContentType0=application%2Fpdf')) {
      type = 'pdf';
    }

    if (messageContent.includes('MediaContentType0=text%2Fvcard')) {
      type = 'vcf';
    }

    return {
      type: 'file',
      fileType: type ?? null,
      fileUrl: fileUrl,
    };
  }

  //currentLocation (Live Location is not currently supported by Twilio)
  if (messageContent.includes('Latitude') && messageContent.includes('Longitude')) {
    const latitudeStartIndex = messageContent.search('Latitude=');
    const latitudeStartLength = 'Latitude='.length;
    const latitudeEndIndex = messageContent.search('&Longitude=');
    const latitude = messageContent.substring(latitudeStartIndex + latitudeStartLength, latitudeEndIndex);

    const longitudeStartIndex = messageContent.search('&Longitude=');
    const longitudeStartLength = '&Longitude='.length;
    const longitudeEndIndex = messageContent.search('&SmsMessageSid=');
    const longitude = messageContent.substring(longitudeStartIndex + longitudeStartLength, longitudeEndIndex);

    const formattedLatitude = parseFloat(latitude).toFixed(6);
    const formattedLongitude = parseFloat(longitude).toFixed(6);

    return {
      type: 'currentLocation',
      latitude: formattedLatitude,
      longitude: formattedLongitude,
    };
  }

  //text
  if (messageContent.includes('&Body=' && '&FromCountry=') || messageContent.includes('&Body=' && '&To=whatsapp')) {
    let text;

    if (messageContent.includes('&Body=' && '&FromCountry=')) {
      const contentStart = '&Body=';
      const contentEnd = '&FromCountry=';
      text = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    } else if (messageContent.includes('&Body=' && '&To=whatsapp')) {
      const contentStart = '&Body=';
      const contentEnd = '&To=whatsapp';
      text = decodeURIComponentMessage(messageContent, contentStart, contentEnd);
    }

    if (!text || text === '') text = 'Unsupported message type';

    return {
      type: 'text',
      text: text,
    };
  }
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
  }

  //text
  return {
    type: 'text',
    text: messageContent?.Body ?? messageContent?.text ?? 'Unsupported message type',
  };
};
