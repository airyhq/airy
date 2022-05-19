import React, {useState, useCallback} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {updateTag} from '../../actions';

import {Button, LinkButton} from 'components';
import ColorSelector from '../../components/ColorSelector';
import Tag from '../../components/Tag';
import {Tag as TagModel, TagColor} from 'model';
import {StateModel} from '../../reducers';

import {ReactComponent as EditPencilIcon} from 'assets/images/icons/editPencil.svg';
import {ReactComponent as TrashIcon} from 'assets/images/icons/trash.svg';

import styles from './TableRow.module.scss';

import {cyTagsTableRowDisplayDeleteModal} from 'handles';
import {useTranslation} from 'react-i18next';

type TableRowProps = {
  tag: TagModel;
  showModal(label: string, id: string, name: string): void;
} & ConnectedProps<typeof connector>;

const TableRowComponent = (props: TableRowProps) => {
  const {
    tag,
    updateTag,
    config: {tagConfig},
    showModal,
  } = props;

  const [tagState, setTagState] = useState({
    edit: false,
    id: '',
    name: '',
    color: '',
  });
  const {t} = useTranslation();

  const handleUpdate = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      if (e.target.name === 'tag_name') {
        setTagState({...tagState, name: e.target && e.target.value});
      } else {
        setTagState({...tagState, color: e.target && (e.target.value as TagColor)});
      }
    },
    [tagState, setTagState]
  );

  const handleTagUpdate = useCallback(() => {
    const currentTag = {
      id: tag.id,
      name: tagState.name,
      color: tagState.color as TagColor,
    };
    updateTag(currentTag);
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
    (e: React.KeyboardEvent) => {
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
    (event: React.BaseSyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
      showModal('confirmDelete', tag.id, tag.name);
    },
    [showModal, tag]
  );

  const getColorValue = useCallback(
    (color: string) => (tagConfig.colors[color] && tagConfig.colors[color].default) || '1578D4',
    [tagConfig]
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
              {t('save')}
            </Button>
            <div className={styles.cancelButton}>
              <LinkButton onClick={cancelTagUpdate}>{t('cancel')}</LinkButton>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr key={tag.id} className={styles.tableRow} onClick={() => setTagState({...tag, edit: true})}>
      <td style={{width: '30%', maxWidth: '1px'}} className={styles.tableCell}>
        <Tag tag={{id: tag.id, color: tag.color as TagColor, name: tag.name}} />
      </td>
      <td style={{width: '30%'}}>
        <span className={styles.tagColor} style={{backgroundColor: `#${getColorValue(tag.color)}`}} />
      </td>
      <td style={{width: '15%'}} />
      <td style={{width: '25%'}}>
        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={() => setTagState({...tag, edit: true})}>
            <EditPencilIcon className={styles.actionSVGEdit} title={t('editTag')} />
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={deleteClicked}
            data-cy={cyTagsTableRowDisplayDeleteModal}
          >
            <TrashIcon className={styles.actionSVG} title={t('deleteTag')} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const mapStateToProps = (state: StateModel) => ({
  config: state.data.config,
});

const mapDispatchToProps = {
  updateTag,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const TableRow = connector(TableRowComponent);
