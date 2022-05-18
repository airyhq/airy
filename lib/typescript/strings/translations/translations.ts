import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  en: {
    translation: {
      channels: {
        chatpluginTitle: 'Chat Plugin',
        chatpluginDescription: 'Best of class browser messenger',
        facebookTitle: 'Facebook Messenger',
        facebookDescription: 'Connect multiple Facebook pages',
        googleTitle: 'Google Business Messages',
        googleDescription: 'Be there when people search',
        instagramTitle: 'Instagram',
        instagramDescription: 'Connect multiple Instagram pages',
        twilioSmsTitle: 'SMS',
        twilioSmsDescription: 'Deliver SMS with ease',
        twilioWhatsappTitle: 'WhatsApp',
        twilioWhatsappDescription: 'World #1 chat app',
      },
    },
  },
  de: {
    translation: {},
  },
  fr: {
    translation: {},
  },
  es: {
    translation: {},
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: window.navigator.language,
  fallbackLng: 'en',
});

export default i18n;
