### HttpClient Library

The HttpClient Library includes a HTTP client for making requests to Airy's API.

The library exports a HttpClient class with public methods that make requests to Airy's API.

To use the library, you need to instantiate the class with an Airy Core API URL.

For example:

```typescript
import { HttpClient} from 'httpclient';

const myInstance = new HttpClient("http://airy.core");
myInstance.listChannels()
    .then((channels) => console.debug("Channels", channels))
```

Here is a list of the public methods the library's class includes:

CHANNELS

- listChannels
- exploreChannels
- connectChannel
- disconnectChannel
- connectFacebookChannel
- exploreFacebookChannels

CONVERSATIONS

- listConversations
- getConversationInfo
- readConversations
- tagConversation
- untagConversation

MESSAGES

- listMessages
- sendMessages

TAGS

- listTags
- createTag
- updateTag
- deleteTag
