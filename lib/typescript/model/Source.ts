export enum Source {
  facebook = 'facebook',
  google = 'google',
  chatPlugin = 'chatplugin',
  twilioSMS = 'twilio.sms',
  twilioWhatsApp = 'twilio.whatsapp',
  twilio = 'twilio',
  instagram = 'instagram',
  viber = 'viber',
  zendesk = 'zendesk',
  dialogflow = 'dialogflow',
}

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

export const getSourceForComponent = (item: string) => {
  const itemArr = item
    .split('-')
    .filter(element => element !== 'enterprise' && element !== 'sources' && element !== 'connector');
  const componentName = itemArr.join(' ').replace(/ /g, '');
  return Source[componentName];
};
