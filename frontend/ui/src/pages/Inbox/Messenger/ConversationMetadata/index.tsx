import React, {FormEvent, useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {
  Tag as TagModel,
  TagColor,
  Note as NoteModel,
  conversationNotes,
  conversationTags,
  getFilteredTags,
} from 'model';

import {createTag, listTags} from '../../../../actions/tags';
import {addTagToConversation, removeTagFromConversation} from '../../../../actions/conversations';
import {updateContact} from '../../../../actions/conversations';
import {
  addNoteToConversation,
  removeNoteFromConversation,
  updateConversationNote,
} from '../../../../actions/conversations';
import {Avatar} from 'components';
import ColorSelector from '../../../../components/ColorSelector';
import Dialog from '../../../../components/Dialog';
import {StateModel} from '../../../../reducers';
import {useAnimation} from '../../../../assets/animations';

import styles from './index.module.scss';
import Tag from '../../../../components/Tag';
import Note from '../../../../components/Note';
import {Button, Input, LinkButton, TextArea} from 'components';
import {getConversation} from '../../../../selectors/conversations';
import {ConversationRouteProps} from '../../index';
import {ReactComponent as EditPencilIcon} from 'assets/images/icons/edit-pencil.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import {ReactComponent as CheckmarkCircleIcon} from 'assets/images/icons/checkmark.svg';

import {
  cyShowTagsDialog,
  cyTagsDialogInput,
  cyTagsDialogButton,
  cyEditDisplayNameIcon,
  cyDisplayName,
  cyDisplayNameInput,
  cyEditDisplayNameCheckmark,
  cyShowNotesDialog,
  cyNotesDialogButton,
  cyNotesDialogInput,
} from 'handles';

const mapStateToProps = (state: StateModel, ownProps: ConversationRouteProps) => {
  return {
    conversation: getConversation(state, ownProps),
    tags: state.data.tags.all,
  };
};

const mapDispatchToProps = {
  createTag,
  listTags,
  addTagToConversation,
  removeTagFromConversation,
  updateContact,
  addNoteToConversation,
  removeNoteFromConversation,
  updateConversationNote,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationMetadata = (props: ConnectedProps<typeof connector>) => {
  const {
    tags,
    createTag,
    conversation,
    listTags,
    addTagToConversation,
    removeTagFromConversation,
    updateContact,
    addNoteToConversation,
    removeNoteFromConversation,
    updateConversationNote,
  } = props;
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [color, setColor] = useState<TagColor>('tag-blue');
  const [tagName, setTagName] = useState('');
  const [showEditDisplayName, setShowEditDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState(conversation.metadata.contact.displayName);
  const [fade, setFade] = useState(true);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteId, setNoteId] = useState('');
  const [notesSortNewest, changeNotesSort] = useState(false);

  useEffect(() => {
    setShowEditDisplayName(false);
    setDisplayName(conversation.metadata.contact.displayName);
  }, [conversation]);

  useEffect(() => {
    listTags();
  }, []);

  const showAddTags = () => {
    setTagName('');
    setShowTagsDialog(true);
  };

  const showAddNotes = () => {
    setNoteText('');
    setNoteId('');
    setShowNotesDialog(true);
  };

  const addTag = (tag: TagModel) => {
    addTagToConversation(conversation.id, tag.id);
  };

  const removeTag = (tag: TagModel) => {
    removeTagFromConversation(conversation.id, tag.id);
  };

  const removeNote = (note: NoteModel) => {
    removeNoteFromConversation(conversation.id, note.id);
  };

  const updateNote = (note: NoteModel) => {
    setNoteText(note.text);
    setShowNotesDialog(true);
    setNoteId(note.id);
  };

  const notesSorter = (a: NoteModel, b: NoteModel) => {
    if (notesSortNewest) {
      return a.timestamp < b.timestamp ? 1 : -1;
    } else {
      return a.timestamp > b.timestamp ? 1 : -1;
    }
  };

  const checkIfExists = (tagName: string) => {
    const usedTags = conversationTags(conversation, tags);
    if (tagName.length === 0) {
      return true;
    }

    if (usedTags.find(tag => tag.name === tagName)) {
      return 'Tag already added';
    }

    return true;
  };

  const submitTagForm = (event: FormEvent) => {
    event.preventDefault();
    const filteredTags = getFilteredTags(conversation, tags, tagName);

    if (filteredTags.length === 1) {
      addTag(filteredTags[0]);
    } else if (filteredTags.length == 0 && tagName.trim().length > 0) {
      createTag({name: tagName.trim(), color}).then((tag: TagModel) => {
        if (tag) {
          addTag(tag);
          setShowTagsDialog(false);
        }
      });
    }
  };

  const submitNoteForm = (event: FormEvent) => {
    event.preventDefault();

    if (noteId === '') {
      addNoteToConversation(conversation.id, noteText);
    } else {
      updateConversationNote(conversation.id, noteId, noteText);
    }

    setShowNotesDialog(false);
  };

  const saveEditDisplayName = () => {
    updateContact(conversation.id, displayName);
    setShowEditDisplayName(!saveEditDisplayName);
  };

  const cancelEditDisplayName = () => {
    setDisplayName(conversation.metadata.contact.displayName);
    useAnimation(setShowEditDisplayName, showEditDisplayName, setFade, 400);
  };

  const editDisplayName = () => {
    setShowEditDisplayName(!showEditDisplayName);
  };

  const renderTagsDialog = () => {
    const filteredTags = getFilteredTags(conversation, tags, tagName);

    return (
      <div className={fade ? styles.fadeInAnimation : styles.fadeOutAnimation}>
        <Dialog close={() => useAnimation(setShowTagsDialog, showTagsDialog, setFade, 400)}>
          <form className={styles.addTags} onSubmit={submitTagForm}>
            <Input
              type="text"
              label="Add a tag"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTagName(e.target.value);
              }}
              height={32}
              value={tagName}
              name="tag_name"
              placeholder="Please enter a tag name"
              autoComplete="off"
              autoFocus
              fontClass="font-base"
              minLength={1}
              maxLength={50}
              validation={checkIfExists}
              showErrors
              dataCy={cyTagsDialogInput}
            />
            {filteredTags.length > 0 ? (
              filteredTags.map(tag => {
                return (
                  <div key={tag.id} className={styles.addTagsRow}>
                    <div className={styles.tag}>
                      <Tag tag={tag} />
                    </div>
                    <LinkButton type="button" onClick={() => addTag(tag)}>
                      Add
                    </LinkButton>
                  </div>
                );
              })
            ) : (
              <div>
                {tagName.length > 0 && <Tag tag={{id: '', color: color, name: tagName}} />}
                <p className={styles.addTagsDescription}>Pick a color</p>
                <ColorSelector
                  handleUpdate={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value as TagColor)}
                  color={color}
                  editing
                />
                <div className={styles.addTagsButtonRow}>
                  <Button type="submit" styleVariant="small" dataCy={cyTagsDialogButton}>
                    Create Tag
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Dialog>
      </div>
    );
  };

  const renderNotesDialog = () => {
    return (
      <div className={fade ? styles.fadeInAnimation : styles.fadeOutAnimation}>
        <Dialog close={() => useAnimation(setShowNotesDialog, showNotesDialog, setFade, 400)}>
          <form className={styles.addNotes} onSubmit={submitNoteForm}>
            <TextArea
              type="textarea"
              label="Add a note"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNoteText(e.target.value);
              }}
              value={noteText}
              name="note_text"
              placeholder="Please enter the note text"
              autoComplete="off"
              autoFocus
              fontClass="font-base"
              minLength={1}
              maxLength={50000}
              showErrors
              dataCy={cyNotesDialogInput}
              minRows={10}
              maxRows={25}
            />
            <div>
              <div className={styles.addNotesButtonRow}>
                <Button type="submit" styleVariant="small" dataCy={cyNotesDialogButton}>
                  Save Note
                </Button>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
    );
  };

  const contact = conversation.metadata.contact;
  return (
    <div className={styles.content}>
      {conversation && (
        <div className={styles.metaPanel}>
          <div className={styles.contact}>
            <div className={styles.avatarImage}>
              <Avatar contact={contact} />
            </div>
            <div className={styles.displayNameContainer}>
              {showEditDisplayName ? (
                <div className={fade ? styles.fadeInAnimation : styles.fadeOutAnimation}>
                  <div className={styles.editDisplayNameContainer}>
                    <Input
                      autoFocus={true}
                      placeholder={conversation.metadata.contact.displayName}
                      value={displayName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDisplayName(event.target.value)}
                      height={32}
                      fontClass="font-base"
                      minLength={1}
                      maxLength={50}
                      label="Set Name"
                      dataCy={cyDisplayNameInput}
                    />
                    <div className={styles.displayNameButtons}>
                      <button className={styles.cancelEdit} onClick={cancelEditDisplayName}>
                        <CloseIcon />
                      </button>
                      <button
                        className={`${displayName.length === 0 ? styles.disabledSaveEdit : styles.saveEdit}`}
                        onClick={saveEditDisplayName}
                        disabled={displayName.length === 0}
                        data-cy={cyEditDisplayNameCheckmark}
                      >
                        <CheckmarkCircleIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.displayName} data-cy={cyDisplayName}>
                    {contact?.displayName}
                  </div>
                  <EditPencilIcon
                    className={styles.editPencilIcon}
                    title="Edit Display Name"
                    onClick={editDisplayName}
                    data-cy={cyEditDisplayNameIcon}
                  />
                </>
              )}
            </div>
          </div>
          <div className={styles.tags}>
            <div className={styles.tagsHeader}>
              <h3 className={styles.tagsHeaderTitle}>Tags</h3>
              <LinkButton onClick={showAddTags} type="button" dataCy={cyShowTagsDialog}>
                {showTagsDialog ? 'Close' : '+ Add Tag'}{' '}
              </LinkButton>
            </div>

            {showTagsDialog && renderTagsDialog()}

            <div className={styles.tagList}>
              {conversationTags(conversation, tags).map(tag => (
                <Tag key={tag.id} tag={tag} removeTag={() => removeTag(tag)} />
              ))}
            </div>
          </div>
          <div className={styles.notes}>
            <div className={styles.notesHeader}>
              <h3 className={styles.notesHeaderTitle}>Notes</h3>
              <LinkButton onClick={showAddNotes} type="button" dataCy={cyShowNotesDialog}>
                {showNotesDialog ? 'Close' : '+ Add Note'}{' '}
              </LinkButton>
            </div>

            {showNotesDialog && renderNotesDialog()}

            {conversationNotes(conversation).sort(notesSorter).length > 1 && (
              <div>
                <span className={styles.sortText}>Sort: </span>
                <span
                  className={`${notesSortNewest ? styles.sortSelected : ''} ${styles.sortOption}`}
                  onClick={() => changeNotesSort(true)}
                >
                  Newest first
                </span>
                <span
                  className={`${notesSortNewest ? '' : styles.sortSelected} ${styles.sortOption}`}
                  onClick={() => changeNotesSort(false)}
                >
                  Oldest first
                </span>
              </div>
            )}

            <div className={styles.noteList}>
              {conversationNotes(conversation)
                .sort(notesSorter)
                .map(note => (
                  <Note
                    key={note.id}
                    note={note}
                    removeNote={() => removeNote(note)}
                    updateNote={() => updateNote(note)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(connector(ConversationMetadata));
