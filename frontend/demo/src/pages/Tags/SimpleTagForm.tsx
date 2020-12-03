import React, {useState, Fragment} from 'react';
import {connect} from 'react-redux';

import {createTag, getTags, errorTag, filterTags} from '../../actions/tags';
import {filteredTags} from '../../selectors/tags';

import {Button, Input} from '@airyhq/components';
import Dialog from '../../components/Dialog';
import ColorSelector from '../../components/ColorSelector';

import Tag from '../../pages/Tags/Tag';

import styles from './SimpleTagForm.module.scss';
import {RootState} from '../../reducers';

const SimpleTagForm = ({errorMessage, createTag, errorTag, onClose, tags}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('tag-blue');
  const [showError, setShowError] = useState(true);
  const handleCreate = () => {
    if (name.trim().length) {
      createTag({name: name.trim(), color}).then((success: any) => {
        if (success) {
          errorTag({status: ''});
          onClose();
        } else {
          setShowError(true);
        }
      });
    } else {
      errorTag({status: 'empty', data: ''});
    }
  };

  const keyPressed = (e: any) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      handleCreate();
    } else if (code === 27) {
      onClose();
    }
  };

  return (
    <Dialog close={onClose} style={tags.length ? {right: 0, top: '32px'} : {top: '200px'}}>
      <div className={styles.tagCreate}>
        <h4 className={styles.headline}>Add a tag</h4>
        <Input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
            setShowError(false);
          }}
          onKeyDown={keyPressed}
          height={32}
          value={name}
          name="tag_name"
          placeholder="Please enter a tag name"
          autoComplete="off"
          autoFocus={true}
          fontClass="font-m"
          maxLength={50}
        />
        <p className={styles.errorMessage}>{(!name.length || showError) && errorMessage}</p>
        {name && (
          <div>
            <Tag tag={{color: color, name: name}} />
          </div>
        )}
        <Fragment>
          <p className={styles.description}>Pick a color</p>
          <ColorSelector handleUpdate={e => setColor(e.target.value)} color={color} editing={true} />
          <div className={styles.buttonRow}>
            <Button styleVariant="small" onClick={handleCreate}>
              Create Tag
            </Button>
          </div>
        </Fragment>
      </div>
    </Dialog>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    tags: filteredTags(state),
    errorMessage: state.data.tags.error,
  };
};

const mapDispatchToProps = {
  createTag,
  errorTag,
  getTags,
  filterTags,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(SimpleTagForm);
