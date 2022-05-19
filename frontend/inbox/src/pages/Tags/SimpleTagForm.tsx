import React, {useState, Fragment} from 'react';
import {connect} from 'react-redux';

import {createTag, listTags, errorTag} from '../../actions/tags';

import {Button, Input} from 'components';
import DialogCustomizable from '../../components/DialogCustomizable';
import ColorSelector from '../../components/ColorSelector';

import Tag from '../../components/Tag';
import {Tag as TagModel, TagColor} from 'model';

import styles from './SimpleTagForm.module.scss';
import {StateModel} from '../../reducers';
import {useTranslation} from 'react-i18next';

type SimpleTagFormProps = {
  errorMessage: string;
  createTag: (CreateTagRequestPayload) => Promise<boolean>;
  errorTag: (ErrorTag) => void;
  onClose: () => void;
  tags: TagModel[];
};

const SimpleTagForm = ({errorMessage, createTag, errorTag, onClose, tags}: SimpleTagFormProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState<TagColor>('tag-blue');
  const [showError, setShowError] = useState(true);
  const {t} = useTranslation();

  const handleCreate = () => {
    if (name.trim().length) {
      createTag({name: name.trim(), color}).then((success: boolean) => {
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

  const keyPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      handleCreate();
    } else if (code === 27) {
      onClose();
    }
  };

  return (
    <DialogCustomizable close={onClose} style={tags.length ? {right: 0, top: '32px'} : {top: '50px', right: '0px'}}>
      <div className={styles.tagCreate}>
        <Input
          label={t('addATag')}
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
            setShowError(false);
          }}
          onKeyDown={keyPressed}
          height={32}
          value={name}
          name="tag_name"
          placeholder={t('enterTagName')}
          autoComplete="off"
          autoFocus={true}
          fontClass="font-base"
          minLength={1}
          maxLength={50}
        />
        <p className={styles.errorMessage}>{(!name.length || showError) && errorMessage}</p>
        {name && (
          <div>
            <Tag tag={{id: '', color: color as TagColor, name: name}} />
          </div>
        )}
        <Fragment>
          <p className={styles.description}>{t('pickColor')}</p>
          <ColorSelector
            handleUpdate={(e: React.ChangeEvent<HTMLInputElement>) => setColor(e.target.value as TagColor)}
            color={color}
            editing={true}
          />
          <div className={styles.buttonRow}>
            <Button styleVariant="small" onClick={handleCreate}>
              {t('createTag')}
            </Button>
          </div>
        </Fragment>
      </div>
    </DialogCustomizable>
  );
};

const mapStateToProps = (state: StateModel) => {
  return {
    tags: Object.values(state.data.tags.all),
    errorMessage: state.data.tags.error,
  };
};

const mapDispatchToProps = {
  createTag,
  errorTag,
  listTags,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(SimpleTagForm);
