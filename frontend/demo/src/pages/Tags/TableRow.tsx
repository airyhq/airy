import React, {useState, useCallback} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';

import styles from './TableRow.module.scss';
import {updateTag} from '../../actions/tags';
import {Button, LinkButton} from '@airyhq/components';
import { ReactComponent as EditIcon } from '@airyhq/components/src/assets/images/icons/edit.svg';
import { ReactComponent as TrashIcon } from '@airyhq/components/src/assets/images/icons/trash.svg';
import ColorSelector from '../../components/ColorSelector';
import { AccessibleSVG } from '../../components/AccessibleSVG';
import Tag from './Tag';
import {Tag as TagModel} from '../../model/Tag';
import { RootState } from '../../reducers'

type TableRowProps = {
  tag: any;
  tagSettings: any;
  showModal(label: string, id: string, name: string): void;
} & ConnectedProps<typeof connector>;

const TableRowComponent = (props: TableRowProps) => {
  const {tag, updateTag, tagSettings, showModal} = props;

  const [tagState, setTagState] = useState({
    edit: false,
    id: null,
    name: '',
    color: '',
  });

  const handleUpdate = useCallback(
    e => {
      e.persist();
      if (e.target.name === 'tag_name') {
        setTagState({...tagState, name: e.target && e.target.value});
      } else {
        setTagState({...tagState, color: e.target && e.target.value});
      }
    },
    [tagState, setTagState]
  );

  const handleTagUpdate = useCallback(() => {
    updateTag(tag.id, tagState.name, tagState.color, tag.count);
    setTagState({
      ...tagState,
      edit: false,
    });
  }, [tag, tagState, updateTag, setTagState]);

  const cancelTagUpdate = useCallback(() => {
    setTagState({
      ...tagState,
      edit: false,
    });
  }, [setTagState]);

  const onTagKeyPressed = useCallback(
    e => {
      const code = e.keyCode || e.which;
      if (code === 13 && tagState.name.length) {
        handleTagUpdate();
      } else if (code === 27) {
        cancelTagUpdate();
      }
    },
    [tagState, handleTagUpdate, cancelTagUpdate]
  );

  const deleteClicked = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      showModal('confirmDelete', tag.id, tag.name);
    },
    [showModal, tag]
  );

  const getColorValue = useCallback(
    color => (tagSettings && tagSettings.colors[color].default) || '1578D4',
    [tagSettings]
  );

  const isEditing = tagState.edit && tagState.id === tag.id;

  if (isEditing) {
    return (
      <tr key={tag.id} className={styles.isEditing}>
        <td style={{width: '30%'}} className={styles.tableCell}>
          <input
            value={tagState.name}
            name="tag_name"
            onChange={handleUpdate}
            onKeyPress={onTagKeyPressed}
            autoFocus={true}
            className={styles.editInput}
            maxLength={50}
            required
          />
        </td>
        <td style={{width: '30%'}}>
          <ColorSelector id={tag.id} handleUpdate={handleUpdate} color={tagState.color} editing={isEditing} />
        </td>
        <td style={{width: '15%'}} />
        <td style={{width: '25%'}}>
          <div className={styles.actions}>
            <Button styleVariant={'small'} disabled={!tagState.name.length} onClick={handleTagUpdate}>
              Save
            </Button>
            <div className={styles.cancelButton}>
              <LinkButton onClick={cancelTagUpdate}>Cancel</LinkButton>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr key={tag.id} className={styles.tableRow} onClick={() => setTagState({...tag, edit: true})}>
      <td style={{width: '30%', maxWidth: '1px'}} className={styles.tableCell}>
        <Tag tag={{color: tag.color, name: tag.name}} />
      </td>
      <td style={{width: '30%'}}>
        <span className={styles.tagColor} style={{backgroundColor: `#${getColorValue(tag.color)}`}} />
      </td>
      <td style={{width: '15%'}} />
      <td style={{width: '25%'}}>
        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={() => setTagState({...tag, edit: true})}>
            {/* <img className={styles.actionSVG} src={edit} title="Edit tag" /> */}
            {/* <AccessibleSVG src={edit} className={styles.actionSVG} title="Edit Tag" /> */}
            <EditIcon className={styles.actionSVG} title="Edit tag" />
          </button>
          <button type="button" className={styles.actionButton} onClick={deleteClicked}>
            <TrashIcon className={styles.actionSVG} title="Delete tag" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    tagSettings: state.data.settings,
  };
};

const mapDispatchToProps = {
  updateTag,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const TableRow = connector(TableRowComponent);
