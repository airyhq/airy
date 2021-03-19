### HttpClient Library

The HttpClient Library includes a HTTP client for making requests to Airy's API.

The library exports a HttpClient class with public methods that make requests to Airy's API.

To use the library, you need to instantiate the class with the authentification token and your api url.

The authentication token is optional, but all endpoints except for `/users.login` and `/users.signup` will fail without it.

For example:

```
import { HttpClient} from 'httpclient';

const myInstance = new HttpClient(apiUrl, authToken);

myInstance.listChannels()

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

USER

- loginViaEmail
