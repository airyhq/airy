import React, {FormEvent, useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Tag as TagModel, TagColor} from 'model';

import {createTag, listTags} from '../../../../actions';
import {addTagToConversation, removeTagFromConversation, updateConversationContactInfo} from '../../../../actions';
import {Avatar} from 'components';
import ColorSelector from '../../../../components/ColorSelector';
import Dialog from '../../../../components/Dialog';
import {StateModel, isComponentHealthy} from '../../../../reducers';
import {useAnimation} from '../../../../assets/animations';
import ContactDetails from './ContactDetails';

import styles from './index.module.scss';
import Tag from '../../../../components/Tag';
import {Button, Input, LinkButton} from 'components';
import {ReactComponent as EditPencilIcon} from 'assets/images/icons/editPencil.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import {ReactComponent as CheckmarkCircleIcon} from 'assets/images/icons/checkmark.svg';
import {ReactComponent as EditIcon} from 'assets/images/icons/pen.svg';
import {ReactComponent as CancelIcon} from 'assets/images/icons/cancelCross.svg';

import {
  cyShowTagsDialog,
  cyTagsDialogInput,
  cyTagsDialogButton,
  cyEditDisplayNameIcon,
  cyDisplayName,
  cyDisplayNameInput,
  cyEditDisplayNameCheckmark,
  cyEditContactIcon,
  cyCancelEditContactIcon,
} from 'handles';
import {difference} from 'lodash-es';
import {useCurrentConversation} from '../../../../selectors/conversations';

const mapStateToProps = (state: StateModel) => ({
  tags: state.data.tags.all,
  config: state.data.config,
});

const mapDispatchToProps = {
  createTag,
  listTags,
  addTagToConversation,
  removeTagFromConversation,
  updateConversationContactInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationMetadata = (props: ConnectedProps<typeof connector>) => {
  const {
    config,
    tags,
    createTag,
    listTags,
    addTagToConversation,
    removeTagFromConversation,
    updateConversationContactInfo,
  } = props;
  const conversation = useCurrentConversation();
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [color, setColor] = useState<TagColor>('tag-blue');
  const [tagName, setTagName] = useState('');
  const [showEditDisplayName, setShowEditDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState(conversation.metadata.contact.displayName);
  const [fade, setFade] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCanceled, setEditingCanceled] = useState(false);
  const [isContactDetailsExpanded, setIsContactDetailsExpanded] = useState(false);

  const isContactsEnabled = isComponentHealthy(config, 'api-contacts');

  useEffect(() => {
    setShowEditDisplayName(false);
    setDisplayName(conversation.metadata.contact.displayName);
  }, [conversation.id]);

  useEffect(() => {
    listTags();
  }, []);

  const showAddTags = () => {
    setTagName('');
    setShowTagsDialog(true);
  };

  const addTag = (tag: TagModel) => {
    addTagToConversation(conversation.id, tag.id);
  };

  const removeTag = (tag: TagModel) => {
    removeTagFromConversation(conversation.id, tag.id);
  };

  const tagSorter = (a: TagModel, b: TagModel) => a.name.localeCompare(b.name);

  const conversationTags = () =>
    Object.keys(conversation.metadata.tags || {})
      .map(tagId => tags[tagId])
      .filter(tag => tag !== undefined)
      .sort(tagSorter);

  const checkIfExists = (tagName: string) => {
    const usedTags = conversationTags();
    if (tagName.length === 0) {
      return true;
    }

    if (usedTags.find(tag => tag.name === tagName)) {
      return 'Tag already added';
    }

    return true;
  };

  const getFilteredTags = (): TagModel[] =>
    difference(Object.keys(tags), Object.keys(conversation.metadata.tags || {}))
      .map(id => tags[id])
      .filter(tag => tag !== undefined)
      .sort(tagSorter)
      .filter((tag: TagModel) => tag.name.startsWith(tagName));

  const submitForm = (event: FormEvent) => {
    event.preventDefault();
    const filteredTags = getFilteredTags();

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

  const saveEditDisplayName = () => {
    updateConversationContactInfo(conversation.id, displayName);
    setShowEditDisplayName(!saveEditDisplayName);
  };

  const cancelEditDisplayName = () => {
    setDisplayName(conversation.metadata.contact.displayName);
    useAnimation(setShowEditDisplayName, showEditDisplayName, setFade, 400);
  };

  const editDisplayName = () => {
    setShowEditDisplayName(!showEditDisplayName);
  };

  const getUpdatedInfo = () => {
    setIsEditing(false);
  };

  const cancelContactsInfoEdit = () => {
    setEditingCanceled(true);
    setIsEditing(false);
  };

  const editContactDetails = () => {
    setEditingCanceled(false);
    setIsEditing(true);
  };

  const getIsExpanded = (isExpanded: boolean) => {
    setIsContactDetailsExpanded(isExpanded);
  };

  const renderTagsDialog = () => {
    const filteredTags = getFilteredTags();

    return (
      <div className={fade ? styles.fadeInAnimation : styles.fadeOutAnimation}>
        <Dialog close={() => useAnimation(setShowTagsDialog, showTagsDialog, setFade, 400)}>
          <form className={styles.addTags} onSubmit={submitForm}>
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

  const contact = conversation.metadata.contact;
  return (
    <div className={styles.content}>
      {isContactsEnabled && (
        <>
          {!isEditing ? (
            <button
              className={`${styles.editIcon} ${isContactDetailsExpanded ? styles.iconBlue : styles.iconGrey}`}
              onClick={editContactDetails}
              data-cy={cyEditContactIcon}
            >
              <EditIcon aria-label="edit contact" />
            </button>
          ) : (
            <button className={styles.editIcon} onClick={cancelContactsInfoEdit} data-cy={cyCancelEditContactIcon}>
              <CancelIcon aria-label="cancel contact edit" />
            </button>
          )}
        </>
      )}

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
            {isContactsEnabled && (
              <ContactDetails
                conversationId={conversation.id}
                isEditing={isEditing}
                getUpdatedInfo={getUpdatedInfo}
                editingCanceled={editingCanceled}
                getIsExpanded={getIsExpanded}
              />
            )}
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
              {conversationTags().map(tag => (
                <Tag key={tag.id} tag={tag} removeTag={() => removeTag(tag)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connector(ConversationMetadata);