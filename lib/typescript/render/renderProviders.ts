import {FacebookRender} from './providers/facebook/FacebookRender';
import {ChatPluginRender} from './providers/chatplugin/ChatPluginRender';
import {TwilioSMSRender} from './providers/twilio/twilioSMS/TwilioSMSRender';
import {TwilioWhatsappRender} from './providers/twilio/twilioWhatsapp/TwilioWhatsappRender';
import {GoogleRender} from './providers/google/GoogleRender';
import {RenderPropsUnion} from './props';

type Provider = (messageRenderProps: RenderPropsUnion) => JSX.Element;

export const renderProviders: {[key: string]: Provider} = {
  facebook: FacebookRender,
  chatplugin: ChatPluginRender,
  'twilio.sms': TwilioSMSRender,
  'twilio.whatsapp': TwilioWhatsappRender,
  google: GoogleRender,
};
