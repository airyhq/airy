import React, { useState, useCallback } from "react";
import _, { connect, ConnectedProps } from "react-redux";

import { updateTag } from "../../actions/tags";

import {
  Button,
  LinkButton,
} from "@airyhq/components";

import edit from "@airyhq/components/src/assets/images/icons/edit.svg";
import trash from '@airyhq/components/src/assets/images/icons/trash.svg';
import ColorSelector from '../../components/ColorSelector';

import Tag from './Tag';
import { Tag as TagModel } from '../../model/Tag';

import styles from "./TableRow.module.scss";
import { RootState } from "../../reducers";

type TableRowProps = {
  tag: any;
  tagSettings: any;
  showModal(label: string, id: string, name: string): void;
  tags: TagModel[];
} & ConnectedProps<typeof connector>;

const TableRowComponent = (props: TableRowProps) => {
  const { tag, updateTag, tagSettings, showModal, tags } = props;

  const [tagState, setTagState] = useState({
    edit: false,
    id: null,
    name: "",
    color: ""
  });

  console.log(tags);

  const handleUpdate = useCallback(
    e => {
      e.persist();
      if (e.target.name === "tag_name") {
        setTagState({ ...tagState, name: e.target && e.target.value });
      } else {
        setTagState({ ...tagState, color: e.target && e.target.value });
      }
    },
    [tagState, setTagState]
  );

  const handleTagUpdate = useCallback(() => {
    updateTag(tag.id, tagState.name, tagState.color, tag.count);
    setTagState({
      ...tagState,
      edit: false
    });
  }, [tag, tagState, updateTag, setTagState]);

  const cancelTagUpdate = useCallback(() => {
    setTagState({
      ...tagState,
      edit: false
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
      showModal("confirmDelete", tag.id, tag.name);
    },
    [showModal, tag]
  );

  const getColorValue = useCallback(
    color =>
      (tagSettings &&
        tagSettings.colors &&
        tagSettings.colors[color].default) ||
      "1578D4",
    [tagSettings]
  );

  const isEditing = tagState.edit && tagState.id === tag.id;

  if (isEditing) {
    return (
      <tr key={tag.id} className={styles.isEditing}>
        <td style={{ width: "30%" }} className={styles.tableCell}>
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
        <td style={{ width: "30%" }}>
          <ColorSelector
            id={tag.id}
            handleUpdate={handleUpdate}
            color={tagState.color}
            editing={isEditing}
          />
        </td>
        <td style={{ width: "15%" }}>{tag.count}</td>
        <td style={{ width: "25%" }}>
          <div className={styles.actions}>
            <Button
              styleVariant={"small"}
              disabled={!tagState.name.length}
              onClick={handleTagUpdate}
            >
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
    <tr
      key={tag.id}
      className={styles.tableRow}
      onClick={() => setTagState({ ...tag, edit: true })}
    >
      <td
        style={{ width: "30%", maxWidth: "1px" }}
        className={styles.tableCell}
      >
        <Tag tag={{ color: tag.color, name: tag.name, count: tag.count}} />
      </td>
      <td style={{ width: "30%" }}>
        <span
          className={styles.tagColor}
          style={{ backgroundColor: `#${getColorValue(tag.color)}` }}
        />
      </td>
      <td style={{ width: "15%" }}>{tag.count}</td>
      <td style={{ width: "25%" }}>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => setTagState({ ...tag, edit: true })}
          >
            <img 
            className={styles.actionSVG} 
            src={edit}
            title="Edit tag" 
            />
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={deleteClicked}
          >
            <img className={styles.actionSVG}
            src={trash}
            title="Delete tag"
            />
          </button>
        </div>
      </td>
    </tr>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    tags: state.data.tags.all,
    // tagSettings: state.data.settings && state.data.settings.contact_tags,
    tagSettings: null
  };
};

const mapDispatchToProps = {
  updateTag
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const TableRow = connector(TableRowComponent);
