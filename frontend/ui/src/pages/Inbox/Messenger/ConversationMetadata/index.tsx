import React, {FormEvent, useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Tag as TagModel, TagColor} from 'model';

import {createTag, listTags} from '../../../../actions/tags';
import {addTagToConversation, removeTagFromConversation} from '../../../../actions/conversations';
import {Avatar} from 'render';
import ColorSelector from '../../../../components/ColorSelector';
import Dialog from '../../../../components/Dialog';
import {StateModel} from '../../../../reducers';

import styles from './index.module.scss';
import Tag from '../../../../components/Tag';
import {Button, Input, LinkButton} from 'components';
import {getConversation} from '../../../../selectors/conversations';
import {ConversationRouteProps} from '../../index';

import {cyShowTagsDialog, cyTagsDialogInput, cyTagsDialogButton} from 'handles';
import difference from 'lodash/difference';

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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationMetadata = (props: ConnectedProps<typeof connector>) => {
  const {tags, createTag, conversation, listTags, addTagToConversation, removeTagFromConversation} = props;
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [color, setColor] = useState<TagColor>('tag-blue');
  const [tagName, setTagName] = useState('');

  useEffect(() => {
    listTags();
  }, []);

  const showAddTags = () => {
    setTagName('');
    setShowTagsDialog(true);
  };

  const addTag = (tag: TagModel) => {
    addTagToConversation(conversation.id, tag.id);
    setShowTagsDialog(false);
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
        }
      });
    }
  };

  const renderTagsDialog = () => {
    const filteredTags = getFilteredTags();

    return (
      <Dialog close={() => setShowTagsDialog(false)}>
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
            <div className={styles.displayName}>{contact?.displayName}</div>
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

export default withRouter(connector(ConversationMetadata));
