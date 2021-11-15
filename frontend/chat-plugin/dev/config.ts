import {Config} from 'chat-plugin';

export const config: Config = {
  welcomeMessage: {
    fallback: 'Hello!\n\nWelcome to Airy!',
    richCard: {
      standaloneCard: {
        cardContent: {
          title: 'Hola!',
          description: 'Welcome to Airy!',
          media: {
            height: 'MEDIUM',
            contentInfo: {
              altText: 'Airy logo',
              fileUrl: 'https://picsum.photos/200',
              forceRefresh: 'false',
            },
          },
          suggestions: [
            {
              reply: {
                text: "Let's start",
                postbackData: '/start',
              },
            },
          ],
        },
      },
    },
  },
  showMode: false,
  inboundMessageColor: '#B8E986',
  inboundMessageTextColor: '#BD10E0',
  outboundMessageColor: '#7ED321',
  outboundMessageTextColor: '#F8E71C',
};
