import {Content} from './Content';

export interface SuggestedReply extends Content {}
export interface Suggestions {
  [suggestionId: string]: SuggestedReply;
}
