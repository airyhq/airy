import React from 'react';
import _, {connect, ConnectedProps} from 'react-redux';

import {Note as NoteModel} from 'model';
import {Settings} from '../../reducers/data/settings';

import {ReactComponent as Close} from 'assets/images/icons/close.svg';
import {ReactComponent as EditPencilIcon} from 'assets/images/icons/edit-pencil.svg';
import styles from './index.module.scss';
import {StateModel} from '../../reducers';

type NoteProps = {
  note: NoteModel;
  expanded?: boolean;
  onClick?: () => void;
  removeNote?: () => void;
  updateNote?: () => void;
  variant?: 'default' | 'light';
} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => {
  return {
    settings: state.data.settings,
  };
};

const connector = connect(mapStateToProps, null);

type noteState = {
  settings: Settings;
};

export const Note = ({note, expanded, variant, onClick, removeNote, updateNote, settings}: NoteProps & noteState): JSX.Element => {
  return (
    <div className={styles.note} onClick={onClick}>
      <div
        className={`${styles.noteInner} ${onClick ? styles.clickable : ''} ${removeNote ? styles.isRemovable : ''}`}
      >
        <span className={`${styles.noteNameExpanded}`}>{note.text}</span>
        <span className={styles.removeNote} onClick={updateNote}>
          <EditPencilIcon className={`${styles.editNote}`} title="Edit note"/>
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

export default connector(Note);
