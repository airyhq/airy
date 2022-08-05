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
  salesforce = 'salesforce',
}

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

export const getSourceForComponent = (item: string) => {
  let formattedItem;

  console.log('item', item);

  if (item.includes('airy-core') || item.includes('airy-enterprise')) {
    formattedItem = item.split('/')[1];
  } else {
    formattedItem = item;
  }

  const itemArr = formattedItem
    .split('-')
    .filter(element => element !== 'enterprise' && element !== 'sources' && element !== 'connector');
  let componentName = itemArr.join(' ').replace(/ /g, '');
  if (componentName === 'chatplugin') componentName = 'chatPlugin';
  if (componentName === 'whatsappbusinesscloud') componentName = 'twilioWhatsApp';
  return Source[componentName];
};
