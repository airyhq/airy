import React from 'react';
import {Message} from '../../../httpclient/model';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {RichCardComponent} from '../../components/RichCard';
import {Content, RichCard} from './ChatPluginModel';

export const ChatPluginRender = (props: MessageRenderProps) => {
  const message = props.message.content;
  let content;

  if (message.includes('richCard')) {
    content = chatPluginRichCard(message);
    props = content.richCard.standaloneCard.cardContent;
  }

  return render(content, props);
};

function render(content, props) {
  switch (content.type) {
    case 'richCard':
      console.log('props', props);
      return <RichCardComponent {...props} />;
  }
}

function chatPluginRichCard(message: string): RichCard {
  const messageJson = JSON.parse(message);

  console.log('messageJson', messageJson);

  // //destructure this
  const richcard = messageJson.richCard.standaloneCard.cardContent;
  return {
    type: 'richCard',
    fallback: messageJson.fallback,
    richCard: {
      standaloneCard: {
        cardContent: {
          title: richcard.title,
          description: richcard.description,
          media: {
            height: richcard.media.height,
            contentInfo: {
              altText: richcard.media.contentInfo.altText,
              fileUrl: richcard.media.contentInfo.fileUrl,
              forceRefresh: richcard.media.contentInfo.forceRefresh,
            },
          },
          suggestions: [
            {
              reply: {
                text: richcard.suggestions[0].reply.text,
                postbackData: richcard.suggestions[0].postbackData,
              },
            },
            {
              reply: {
                text: richcard.suggestions[1].reply.text,
                postbackData: richcard.suggestions[1].postbackData,
              },
            },
          ],
        },
      },
    },
  };
}
