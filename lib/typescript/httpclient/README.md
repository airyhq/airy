
### HttpClient Library 

The HttpClient Library includes helper functions for using Airy's endpoints on the frontend.

Each function performs an http request and returns a promise.

To use the library's functions, import the library and call the module's methods.
For example:

``` 
import { HttpClient} from 'httpclient';

HttpClient.listChannels()

``` 

Here is a list of the functions it includes: 

CHANNELS
- listChannels
- exploreChannels 
- connectChannel
- disconnectChannel 

CONVERSATIONS 
- listConversations

TAGS 
- listTags
- createTag
- updateTag
- deleteTag

USER 
- loginViaEmail



