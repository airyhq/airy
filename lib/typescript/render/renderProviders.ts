import {MetaRender} from './providers/meta/MetaRender';
import {ChatPluginRender} from './providers/chatplugin/ChatPluginRender';
import {GoogleRender} from './providers/google/GoogleRender';
import {TwilioRender} from './providers/twilio/TwilioRender';
import {ViberRender} from './providers/viber/ViberRender';
import {RenderPropsUnion} from './props';

type Provider = (messageRenderProps: RenderPropsUnion) => JSX.Element;

export const renderProviders: {[key: string]: Provider} = {
  facebook: MetaRender,
  instagram: MetaRender,
  whatsapp: MetaRender,
  chatplugin: ChatPluginRender,
  'twilio.sms': TwilioRender,
  'twilio.whatsapp': TwilioRender,
  google: GoogleRender,
  viber: ViberRender,
};
