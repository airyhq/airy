export interface Attachment {
  type: string;
  title?: string;
  url?: string | null;
}
export interface SimpleAttachment {
  type: 'image' | 'video' | 'audio' | 'file' | 'fallback' | 'share' | 'story_mention';
  title?: string;
  url?: string;
  payload?: {title?: string; url?: string} | null;
}

export interface URLButton extends Content {
  type: 'web_url' | 'open_url';
  url: string;
  title: string;
}

export interface PostbackButton extends Content {
  type: 'postback';
  title: string;
  payload: string;
}

export interface CallButton extends Content {
  type: 'phone_number';
  title: string;
  payload: string;
}

export interface LoginButton extends Content {
  type: 'account_link';
  url: string;
}

export interface LogoutButton extends Content {
  type: 'account_unlink';
}

export interface GamePlayButton extends Content {
  type: 'game_play';
  title: 'Play';
  payload?: string;
  game_metadata?: {
    player_id?: string;
    context_id?: string;
  };
}

export interface ButtonAttachment extends Attachment {
  type: 'template';
  payload: {
    text: string;
    template_type: 'button';
    buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
  };
}
export interface GenericAttachment extends Attachment {
  type: 'template';
  payload: {
    text: string;
    template_type: 'generic';
    elements: Element[];
  };
}

export interface MediaTemplate extends Content {
  type: 'mediaTemplate';
  media_type: 'video' | 'image';
  url?: string;
  attachment_id?: string;
  buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
}

export interface MediaAttachment extends Attachment {
  type: 'template';
  payload: {
    template_type: 'media';
    elements: MediaTemplate[];
  };
}

export interface Element {
  title: string;
  subtitle?: string;
  image_url?: string;
  default_action?: {
    type: string;
    url?: string;
  };
  buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
}

export interface Content {
  type: string;
  text?: string;
}

export interface TextContent extends Content {
  type: 'text';
}

export interface ImageContent extends Content {
  type: 'image';
  imageUrl: string;
}

export interface AudioContent extends Content {
  type: 'audio';
  audioUrl: string;
}

export interface FileContent extends Content {
  type: 'file';
  fileUrl: string;
}

export interface ImagesContent extends Content {
  type: 'images';
  images: ImageContent[];
}

export interface VideoContent extends Content {
  type: 'video';
  videoUrl: string;
}

export interface QuickReply {
  content_type: string;
  title: string;
  payload: string;
  image_url?: string;
}

export interface QuickRepliesContent extends Content {
  type: 'quickReplies';
  text?: string;
  attachment?: AttachmentUnion;
  quickReplies: QuickReply[];
}

export interface ButtonTemplate extends Content {
  type: 'buttonTemplate';
  text: string;
  buttons: (URLButton | PostbackButton | CallButton | LoginButton | LogoutButton | GamePlayButton)[];
}

export interface GenericTemplate extends Content {
  type: 'genericTemplate';
  text?: string;
  elements: Element[];
}

export interface Fallback extends Content {
  type: 'fallback';
  text?: string;
  title: string;
  url: string;
}

//Instagram-specific
export interface StoryMentionContent extends Content {
  type: 'story_mention';
  url: string;
  sentAt: Date;
}

export interface StoryRepliesContent extends Content {
  type: 'story_replies';
  url: string;
  sentAt: Date;
}

export interface ShareContent extends Content {
  type: 'share';
  url: string;
}

export interface DeletedMessageContent extends Content {
  type: 'deletedMessage';
}

///////////////// WhatsApp BusinessCloud 
//can you split the model in different files?

//WA Text object 
export interface WhatsAppTextContent extends Content {
  type: string;
  text: string;
  preview_url: boolean;
  body: string;
}

//WA Media object
// export interface WhatsAppMediaObject {
//   id?: string;
//   link?: string;
//   caption?: string;
//   filename?: string;
//   provider?: string;
// }

export interface WhatsAppImageMedia extends Content {
  type: 'image';
  image: WhatsAppMediaObject;
}

export interface WhatsAppVideoMedia extends Content {
  type: 'video';
  video: WhatsAppMediaObject;
}

export interface WhatsAppStickerMedia extends Content {
  type: 'sticker';
  sticker: WhatsAppMediaObject;
}

export interface WhatsAppAudioMedia extends Content {
  type: 'audio';
  audio: WhatsAppMediaObject;
}

export interface WhatsAppDocumentMedia extends Content {
  type: 'document';
  document: WhatsAppMediaObject;
}
//end of WA Media object

//WA Location object (same as Twilio WA?)
export interface WhatsAppLocationObject {
  longitude: string;
  latitude: string;
  name: string;
  address: string;
}

export interface WhatsAppHeaderObject extends Content{
  type:   "text" | "video" | "image" | "document";
  document?: WhatsAppMediaObject;
  image?: WhatsAppMediaObject;
  video?: WhatsAppMediaObject;
  text?: string;
}

//WA Interactive object
export interface WhatsAppInteractiveObject extends Content {
  type: 'button' | 'list' | 'product' | 'product_list';
  action: {[key: string]: string};
  body?: {text: string};
  footer?: {text: string};
  header?: WhatsAppHeaderObject;
}

//WA Adresses object for WA Contacts Object
export interface WhatsAppAddressesObject {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  country_code?:string;
  type?: string;
}

//WhatsAppNameObject for WA Contacts Object
interface WhatsAppNameObject {
  formatted_name: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  suffix?:string;
  prefix?:string;
}


//WA Contacts object 
//make enum 'HOME' | 'WORK'
export interface WhatsAppContactsObject extends Content {
  name: WhatsAppNameObject;
  addresses?: WhatsAppAddressesObject;
  birthday?: string;
  emails?: {type?: 'HOME' | 'WORK'; email?: string};
  org?: {company?: string; department?: string; title?: string};
  phones?: {phone?: string; type?: 'CELL' | 'MAIN' | 'IPHONE' | 'HOME' | 'WORK'; wa_id?: string};
  urls?: {url?: string; type?: 'HOME' | 'WORK'};
}

//beginning of WA Template object

//abstract those objects with one interface that you extend 
//with common property: fallback_value?
export interface WhatsAppCurrencyObject {
  fallback_value: string;
  code: string;
  amount_1000: string;
}

export interface WhatsAppDateTimeObject {
  fallback_value: string;
}

export interface WhatsAppDocumentObject extends WhatsAppMediaObject {}

//create image & video objects that extends from  WhatsAppMediaObject

export interface WhatsAppParameterObject extends Content {
  type: "currency" | "date_time" | "document" | "image" | "text" | "video";
  text?: string;
  currency?: WhatsAppCurrencyObject;
  date_time?: WhatsAppDateTimeObject;
  document?: WhatsAppDocumentObject;
  //create image & video objects that extends from  WhatsAppMediaObject?
  image?: WhatsAppMediaObject;
  video?: WhatsAppMediaObject;
}


//--> is this similar to FB's Quick Reply?
export interface WhatsAppButtonObject extends Content {
  type: "button";
  sub_type: "quick_reply";
  index: string;
  parameters: [
    {
      type: string;
      payload: any;
      text?: string;
    }
  ]
}

//WA Component object
export interface WhatsAppComponents {
  type: 'body' | 'header' | 'button';
  parameters: (WhatsAppParameterObject | WhatsAppButtonObject)[];
  sub_type?: 'quick_reply' | 'url';
  index?: number;
}

//WA template object
export interface WhatsAppLanguageObject {
    code: string;
}

//WA template object
//! WhatsAppTemplate or WhatsAppTemplateObject?
export interface WhatsAppTemplateObject extends Content {
  type: "template";
  template: { name: string; language: WhatsAppLanguageObject;}
  components?: WhatsAppComponents[];
}

//WA Message object 
// ---> message object with the content you want to send
export interface WhatsAppMessageObject {
  audio?: WhatsAppMediaObject;
  contacts?: WhatsAppContactsObject;
  context?: {message_id: string};
  document?: WhatsAppMediaObject;
  image?: WhatsAppMediaObject;
  interactive?: WhatsAppInteractiveObject;
  location?: WhatsAppLocationObject;
  messaging_product: "whatsapp";
  preview_url?: boolean;
  recipient_type?: string;
  status: string;
  sticker?: WhatsAppMediaObject;
  template?: WhatsAppTemplateObject;
  text?: WhatsAppTextContent;
  to: string;
  type?: string;
}

export enum WhatsAppMediaType {
  video = 'video',
  image = 'image',
  document = 'document',
  audio = 'audio',
  sticker = 'sticker',
}

//create Media object with {link: string, caption?: string;} and 
//extend WhatsAppMediaObject or add it to WhatsAppMediaObject?

export interface WhatsAppMediaObject extends Content {
  type: "whatsAppMedia";
  mediaType: WhatsAppMediaType;
  link: string;
  caption?: string;
}

export interface WhatsAppLocation extends Content {
  type: 'location';
  longitude: string;
  latitude: string;
  name?: string;
  address?: string;
}

//create Media object with {link: string, caption?: string;} and 
//extend WhatsAppMediaObject or add it to WhatsAppMediaObject?

export interface WhatsAppInteractiveHeader {
  type: 'text' | 'video' | 'image' | 'document';
  text?: string;
  video?: {link: string; caption?: string;};
  image?:  {link: string; caption?: string;};
  document?:  {link: string; caption?: string};
}

export enum WhatsAppInteractiveType {
  "button" = "button",
  "list" = "list",
  "product" = "product",
  "product_list" = "product_list"
}

//interactive 
export interface WhatsAppInteractive extends Content {
  type: 'whatsAppInteractive';
  interactiveType: WhatsAppInteractiveType;
  header: WhatsAppInteractiveHeader;
  body?: {text: string};
  footer?: {text: string};
}


// Add a new facebook content model here:
export type ContentUnion =
  | TextContent
  | PostbackButton
  | ImageContent
  | AudioContent
  | ImagesContent
  | VideoContent
  | FileContent
  | ButtonTemplate
  | GenericTemplate
  | QuickRepliesContent
  | MediaTemplate
  | StoryMentionContent
  | StoryRepliesContent
  | ShareContent
  | Fallback
  | DeletedMessageContent
  | WhatsAppTemplateObject
  | WhatsAppMediaObject
  | WhatsAppLocation
  | WhatsAppInteractive;

export type AttachmentUnion =
  | TextContent
  | ImageContent
  | VideoContent
  | FileContent
  | AudioContent
  | ButtonTemplate
  | GenericTemplate
  | MediaTemplate
  | Fallback
  | StoryMentionContent
  | ShareContent;
