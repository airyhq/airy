import React from 'react';
import {Text} from '../../components/Text';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './viberModel';
import {Image} from '../../components/Image';
import {Video} from '../../components/Video';

export const ViberRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact ? inboundContent(message) : outboundContent(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.message.fromContact || false} text={content.text} />;
    case 'picture':
      return (
        <div>
          <Image imageUrl={content.media} altText={content.text} />
          <Text fromContact={props.message.fromContact || false} text={content.text} />
        </div>
      );
    case 'contact':
      return (
        <Text
          fromContact={props.message.fromContact || false}
          text={`Shared this contact with you: ${content.contact.name} (${content.contact.phone_number})`}
        />
      );
    case 'video':
      return <Video videoUrl={content.media} />;
  }

  return null;
}

// Viber already uses a type identifier so we only need to cast to our interface
const inboundContent = (message): ContentUnion => message.content?.message;

const outboundContent = (message): ContentUnion => message.content;
