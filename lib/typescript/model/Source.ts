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
  congnigy = 'congnigy',
  rasa = 'rasa',
  webhooks = 'webhooks',
  amelia = 'amelia',
  frontendinbox = 'frontendinbox',
  mobile = 'mobile',
  whatsapp = 'whatsapp',
}

export const prettifySource = (source: string) =>
  source
    .split('.')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');


export const getSourceForComponent = (item: string, displayName?: string) => {
  let formattedItem;

  if (item.includes('airy-core') || item.includes('airy-enterprise')) {
    formattedItem = item.split('/')[1];
  } else {
    formattedItem = item;
  }

  console.log('formattedItem', formattedItem);

  const itemArr = formattedItem
    .split('-')
    .filter(element => element !== 'enterprise' && element !== 'sources' && element !== 'connector');
    console.log('itemArr', itemArr);
  let componentName = itemArr.join(' ').replace(/ /g, '');
  if (componentName === 'chatplugin') componentName = 'chatPlugin';
  if (componentName === 'whatsappbusinesscloud') componentName = 'twilioWhatsApp';
  if (componentName === 'salesforcecontactsingestion') componentName = 'salesforce';

  console.log('SOURCE FOR componentName', componentName);

  return Source[componentName];
};
