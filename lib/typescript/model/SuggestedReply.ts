import {Content} from './Content';
export interface SuggestedReply {
  content: Content;
}
export interface Suggestions {
  [suggestionId: string]: SuggestedReply;
}
