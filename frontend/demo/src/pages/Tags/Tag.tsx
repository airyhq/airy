import React from 'react';
import _, {connect, ConnectedProps} from 'react-redux';

import {Tag as TagModel} from 'httpclient';

import {StateModel} from '../../reducers';

import close from '../../assets/images/icons/close.svg';

import styles from './Tag.module.scss';

type TagProps = {
  tag: TagModel;
  expanded?: boolean;
  onClick?: () => void;
  removeTagFromContact?: () => void;
  variant?: 'default' | 'light';
} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => {
  return {
    tagSettings: state.data.settings,
  };
};

const connector = connect(mapStateToProps, null);

const Tag = (props: TagProps) => {
  const {tag, expanded, variant, onClick, removeTagFromContact, tagSettings} = props;

  const tagColor = (tagSettings && tagSettings.colors[tag.color]) || {
    background: 'F1FAFF',
    border: '1578D4',
    default: '1578D4',
    font: '1578D4',
  };

  const tagStyle = () => {
    if (variant === 'light') {
      return {
        backgroundColor: `#${tagColor.background}`,
        color: `#${tagColor.font}`,
        border: `1px solid #${tagColor.border}`,
      };
    }

    return {backgroundColor: `#${tagColor.default}`};
  };

  return (
    <div className={styles.tag} onClick={onClick}>
      <div
        className={`${styles.tagInner} ${onClick ? styles.clickable : ''} ${
          removeTagFromContact ? styles.isRemovable : ''
        }`}
        style={tagStyle()}>
        <span className={`${expanded === true ? styles.tagNameExpanded : styles.tagName}`}>{tag.name}</span>
        {removeTagFromContact && (
          <span className={styles.removeTag} onClick={removeTagFromContact}>
            <img className={styles.closeButton} src={close} title="Delete" />
          </span>
        )}
      </div>
    </div>
  );
};

export default connector(Tag);
