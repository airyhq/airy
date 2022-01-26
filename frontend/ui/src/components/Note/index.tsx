import React from 'react';
import {dateFormat} from '../../services/format/date';
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
  if (!note.timestamp || !note.text) return null;
  return (
    <div className={styles.note} onClick={onClick}>
      <div className={`${styles.noteInner} ${onClick ? styles.clickable : ''} ${removeNote ? styles.isRemovable : ''}`}>
        <div>
          <span className={`${styles.noteNameExpanded}`}>{note.text}</span>
          {removeNote && (
            <span className={styles.removeNote} onClick={removeNote}>
              <Close className={styles.closeButton} title="Delete" />
            </span>
          )}
          <span className={styles.removeNote} onClick={updateNote}>
            <EditPencilIcon className={`${styles.editNote}`} title="Edit note" />
          </span>
        </div>
        <div>
          <p className={`${styles.noteDate}`}>{dateFormat(note.timestamp, true)}</p>
        </div>
      </div>
    </div>
  );
};

export default Note;
