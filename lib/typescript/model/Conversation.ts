import {Contact} from './Contact';
import {Message} from './Message';
import {Metadata} from './Metadata';
import {Channel} from './Channel';
import {Tag as TagModel} from './Tag';
import {Note as NoteModel} from './Note';
import {difference} from 'lodash-es';

export type ConversationMetadata = Metadata & {
  contact: Contact;
  unreadCount: number;
  tags: {
    [tagId: string]: string;
  };
  notes: {
    [noteId: string]: {
      text: string;
      timestamp: string;
    };
  };
  state: string;
};

export interface Conversation {
  id: string;
  channel: Channel;
  metadata: ConversationMetadata;
  createdAt: Date;
  lastMessage: Message;
}

export function conversationNotes(conversation: Conversation) {
  return Object.keys(conversation.metadata.notes || {})
    .map(noteId => {
      return {
        id: noteId,
        text: conversation.metadata.notes[noteId]['text'],
        timestamp: conversation.metadata.notes[noteId]['timestamp']
          ? new Date(parseInt(conversation.metadata.notes[noteId]['timestamp']))
          : null,
      } as NoteModel;
    })
    .filter(note => note !== undefined);
}

const tagSorter = (a: TagModel, b: TagModel) => a.name.localeCompare(b.name);

export function conversationTags(conversation: Conversation, tags: {[tagId: string]: TagModel}) {
  return Object.keys(conversation.metadata.tags || {})
    .map(tagId => tags[tagId])
    .filter(tag => tag !== undefined)
    .sort(tagSorter);
}

export function getFilteredTags(conversation: Conversation, tags: {[tagId: string]: TagModel}, tagName) {
  return difference(Object.keys(tags), Object.keys(conversation.metadata.tags || {}))
    .map(id => tags[id])
    .filter(tag => tag !== undefined)
    .sort(tagSorter)
    .filter((tag: TagModel) => tag.name.startsWith(tagName));
}
