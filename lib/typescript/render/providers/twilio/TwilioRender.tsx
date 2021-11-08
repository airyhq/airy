import React from 'react';
import {Text, Image, File} from '../../components';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './twilioModel';

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
    const imageUrlStart = messageContent.search('MediaUrl0=');
    console.log('imageUrlStart', imageUrlStart);
    const imageUrlEnd = messageContent.search('&ApiVersion=');
    console.log('imageUrlEnd', imageUrlEnd);
    const imageUrlLength = imageUrlEnd - imageUrlStart;
    const enCodedText = messageContent.substring(imageUrlStart + 10, imageUrlEnd);
    const replaced = enCodedText.split('+').join(' ');
    console.log('replaced', replaced);
    const imageUrl = decodeURIComponent(replaced);

    return {
      type: 'image',
      imageUrl: imageUrl,
    };
  }

  //file: pdf
  if (messageContent.includes('MediaContentType0=application%2Fpdf')) {
    const imageUrlStart = messageContent.search('MediaUrl0=');
    console.log('imageUrlStart', imageUrlStart);
    const imageUrlEnd = messageContent.search('&ApiVersion=');
    console.log('imageUrlEnd', imageUrlEnd);
    const imageUrlLength = imageUrlEnd - imageUrlStart;
    const enCodedText = messageContent.substring(imageUrlStart + 10, imageUrlEnd);
    const replaced = enCodedText.split('+').join(' ');
    console.log('replaced', replaced);
    const fileUrl = decodeURIComponent(replaced) + '.pdf';

    console.log('fileUrl', fileUrl);

    return {
      type: 'file',
      fileUrl: fileUrl,
    };
  }

  //text
  if (messageContent.includes('&Body=' && '&FromCountry=')) {
    const startText = messageContent.search('&Body=');
    const endText = messageContent.search('&FromCountry=');
    const textLength = endText - startText;
    const enCodedText = messageContent.substring(startText + 6, startText + textLength);
    const replaced = enCodedText.split('+').join(' ');
    text = decodeURIComponent(replaced);
  } else if (messageContent.includes('&Body=' && '&To=whatsapp')) {
    const startText = messageContent.search('&Body=');
    const endText = messageContent.search('&To=whatsapp');
    const textLength = endText - startText;
    const enCodedText = messageContent.substring(startText + 6, startText + textLength);
    const replaced = enCodedText.split('+').join(' ');
    text = decodeURIComponent(replaced);
  }

  return {
    type: 'text',
    text: text,
  };
};

//test sending with outbound
//add right extensions in services
const outboundContent = (message): ContentUnion => {
  const messageContent = message.content.message ?? message.content;
  console.log('messageContent - outbound', messageContent);

  return {
    type: 'text',
    text: messageContent.Body,
  };
};

// 'MediaContentType0=image%2Fjpeg&SmsMessageSid=MMdb939435611dc755f5c831cae70b75fc&NumMedia=
// 1&ProfileName=Audrey&SmsSid=MMdb939435611dc755f5c831cae70b75fc&WaId=4915217532498&SmsStatus=
// received&Body=&To=whatsapp%3A%2B14155238886&NumSegments=1&MessageSid=MMdb939435611dc755f5c83
// 1cae70b75fc&AccountSid=AC64c9ab479b849275b7b50bd19540c602&From=whatsapp%3A%2B4915217532498
// &MediaUrl0=https%3A%2F%2Fapi.twilio.com%2F2010-04-01%2FAccounts%2FAC64c9ab479b849275b7b50bd19540c602%2FMessages%2FMMdb939435611dc755f5c831cae70b75fc%2FMedia%2FME4300daed58bd89c592bd9e1cda7d2619&ApiVersion=2010-04-01'
