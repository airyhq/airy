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


const ConversationMetadataTags = () => {
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
}