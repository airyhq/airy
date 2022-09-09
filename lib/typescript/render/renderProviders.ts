import {FacebookRender} from './providers/facebook/FacebookRender';
import {ChatPluginRender} from './providers/chatplugin/ChatPluginRender';
import {GoogleRender} from './providers/google/GoogleRender';
import {TwilioRender} from './providers/twilio/TwilioRender';
import {ViberRender} from './providers/viber/ViberRender';
import {RenderPropsUnion} from './props';

type Provider = (messageRenderProps: RenderPropsUnion) => JSX.Element;

export const renderProviders: {[key: string]: Provider} = {
  facebook: FacebookRender,
  instagram: FacebookRender,
  whatsapp: FacebookRender,
  chatplugin: ChatPluginRender,
  'twilio.sms': TwilioRender,
  'twilio.whatsapp': TwilioRender,
  google: GoogleRender,
  viber: ViberRender,
};
