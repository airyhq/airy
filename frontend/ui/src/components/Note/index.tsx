import React from 'react';

import {Note as NoteModel} from 'model';

import {ReactComponent as Close} from 'assets/images/icons/close.svg';
import {ReactComponent as EditPencilIcon} from 'assets/images/icons/edit-pencil.svg';
import styles from './index.module.scss';

type NoteProps = {
  note: NoteModel;
  onClick?: () => void;
  removeNote?: () => void;
  updateNote?: () => void;
};

const Note = ({note, onClick, removeNote, updateNote}: NoteProps): JSX.Element => {
  return (
    <div className={styles.note} onClick={onClick}>
      <div className={`${styles.noteInner} ${onClick ? styles.clickable : ''} ${removeNote ? styles.isRemovable : ''}`}>
        <span className={`${styles.noteNameExpanded}`}>{note.text}</span>
        <span className={styles.removeNote} onClick={updateNote}>
          <EditPencilIcon className={`${styles.editNote}`} title="Edit note" />
        </span>
        {removeNote && (
          <span className={styles.removeNote} onClick={removeNote}>
            <Close className={styles.closeButton} title="Delete" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Note;
